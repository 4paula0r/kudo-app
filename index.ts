import 'dotenv/config'
import express,{Request,Response,NextFunction} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {PrismaClient,TxType} from '@prisma/client'
import {z} from 'zod'

const app=express(),db=new PrismaClient(),port=Number(process.env.PORT||4000),secret=process.env.JWT_SECRET
if(!secret)throw new Error('Configura JWT_SECRET en backend/.env')
app.use(helmet());app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173'}));app.use(express.json({limit:'1mb'}));app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:true,legacyHeaders:false}))
type Authed=Request&{userId?:string}
function auth(req:Authed,res:Response,next:NextFunction){const raw=req.headers.authorization?.replace(/^Bearer\s+/i,'');if(!raw)return res.status(401).json({message:'Inicia sesión para continuar.'});try{req.userId=(jwt.verify(raw,secret!) as {sub:string}).sub;next()}catch{return res.status(401).json({message:'Tu sesión venció. Inicia sesión de nuevo.'})}}
const credentials=z.object({email:z.string().email().max(200),password:z.string().min(8).max(100)}),error=(res:Response,e:unknown)=>res.status(400).json({message:e instanceof z.ZodError?e.issues[0]?.message:'Revisa los datos ingresados.'})
app.get('/api/health',(_req,res)=>res.json({ok:true}))
app.post('/api/auth/register',async(req,res)=>{try{const d=credentials.extend({name:z.string().min(2).max(80)}).parse(req.body);const email=d.email.toLowerCase();if(await db.user.findUnique({where:{email}}))return res.status(409).json({message:'Ya existe una cuenta con ese correo.'});const user=await db.user.create({data:{email,name:d.name,passwordHash:await bcrypt.hash(d.password,12)}});return res.status(201).json({token:jwt.sign({},secret!,{subject:user.id,expiresIn:'7d'}),user:{id:user.id,name:user.name,email:user.email}})}catch(e){return error(res,e)}})
app.post('/api/auth/login',async(req,res)=>{try{const d=credentials.parse(req.body),user=await db.user.findUnique({where:{email:d.email.toLowerCase()}});if(!user||!await bcrypt.compare(d.password,user.passwordHash))return res.status(401).json({message:'Correo o contraseña incorrectos.'});return res.json({token:jwt.sign({},secret!,{subject:user.id,expiresIn:'7d'}),user:{id:user.id,name:user.name,email:user.email}})}catch(e){return error(res,e)}})
app.get('/api/transactions',auth,async(req:Authed,res)=>{const transactions=await db.transaction.findMany({where:{userId:req.userId},orderBy:{date:'desc'},take:100});res.json({transactions:transactions.map(t=>({...t,amount:Number(t.amount)}))})})
app.post('/api/transactions',auth,async(req:Authed,res)=>{try{const d=z.object({title:z.string().min(1).max(100),category:z.string().min(1).max(40),type:z.nativeEnum(TxType),amount:z.number().positive().max(999999999),date:z.string().datetime(),paymentMethod:z.string().max(30).optional()}).parse(req.body);const transaction=await db.transaction.create({data:{...d,amount:d.amount,date:new Date(d.date),userId:req.userId!}});return res.status(201).json({transaction:{...transaction,amount:Number(transaction.amount)}})}catch(e){return error(res,e)}})
app.get('/api/goals',auth,async(req:Authed,res)=>{const goals=await db.goal.findMany({where:{userId:req.userId},orderBy:{createdAt:'desc'}});res.json({goals:goals.map(g=>({...g,target:Number(g.target),saved:Number(g.saved)}))})})
app.post('/api/goals',auth,async(req:Authed,res)=>{try{const d=z.object({name:z.string().min(2).max(80),target:z.number().positive().max(999999999),deadline:z.string().datetime()}).parse(req.body);const goal=await db.goal.create({data:{...d,deadline:new Date(d.deadline),userId:req.userId!}});return res.status(201).json({goal:{...goal,target:Number(goal.target),saved:Number(goal.saved)}})}catch(e){return error(res,e)}})
app.use((err:unknown,_req:Request,res:Response,_next:NextFunction)=>{console.error(err);res.status(500).json({message:'Ocurrió un error interno.'})})
app.listen(port,()=>console.log(`KUDO API disponible en http://localhost:${port}`))
