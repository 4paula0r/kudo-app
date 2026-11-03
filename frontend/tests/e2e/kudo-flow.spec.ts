import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const frontendDir = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const screenshotsDir = resolve(frontendDir, '../docs/evidencias/pruebas/capturas')
mkdirSync(screenshotsDir, { recursive: true })

test('recorrido E2E completo de KUDO 2.0', async ({ page }) => {
  const email = 'kudo-e2e-' + Date.now() + '@example.test'
  const password = 'E2e-only-Password-2026!'

  await test.step('1. Abrir la aplicación y ver la pantalla inicial', async () => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /YOUR MONEY\. YOUR MOVE\.|TUS FINANZAS,.*EN TIEMPO REAL\./ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Crear cuenta', exact: true })).toBeVisible()
    await page.screenshot({ path: resolve(screenshotsDir, '01-inicio-publico.png'), fullPage: true })
  })

  await test.step('11. Bloquear una ruta privada sin sesión', async () => {
    await page.goto('/finanzas')
    await expect(page).toHaveURL(/\/login$/)
    const loginHeading = page.getByRole('heading', { name: /Bienvenido de nuevo|Qué bueno verte de nuevo/ })
    if (await loginHeading.count()) await expect(loginHeading).toBeVisible()
  })

  await test.step('2. Crear una cuenta sintética', async () => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Crear cuenta', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Hola, ¿cómo te llamas?' })).toBeVisible()
    await page.getByLabel('Tu nombre').fill('Usuario E2E')
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await page.getByLabel('Edad').fill('25')
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await page.getByLabel('Moneda').selectOption('GTQ')
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await expect(page.getByRole('heading', { name: '¿En qué categorías gastas?' })).toBeVisible()
    await page.getByRole('button', { name: /Siguiente/ }).click()
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByPlaceholder('Mínimo 8 caracteres').fill(password)
    await page.getByLabel('Confirmar contraseña').fill(password)
    await page.locator('.auth-submit').click()
    await page.getByRole('button', { name: 'Saltar recorrido' }).click()
    await expect(page.getByRole('heading', { name: /Hola, Usuario/ })).toBeVisible()
    await page.screenshot({ path: resolve(screenshotsDir, '02-cuenta-y-dashboard.png'), fullPage: true })
  })

  await test.step('3. Cerrar sesión y probar credenciales incorrectas', async () => {
    await closeSession(page)
    const loginCta = page.getByRole('button', { name: /Iniciar sesión|Ya tengo una cuenta/ })
    if (await loginCta.count()) await loginCta.click()
    await page.getByLabel('Correo electrónico').fill(email)
    await page.getByPlaceholder('Mínimo 8 caracteres').fill('Wrong-password-2026!')
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('alert')).toBeVisible()
  })

  await test.step('4. Iniciar sesión con credenciales válidas', async () => {
    await page.getByPlaceholder('Mínimo 8 caracteres').fill(password)
    await page.locator('.auth-submit').click()
    await expect(page.getByRole('heading', { name: /Hola, Usuario/ })).toBeVisible()
  })

  await test.step('5. Registrar un ingreso de Q1,000', async () => {
    await page.locator('nav').getByRole('link', { name: /Añadir/ }).click()
    await page.locator('.form-type').getByRole('button', { name: /Ingreso/ }).click()
    await page.getByLabel('Monto').fill('1000')
    await page.getByLabel('Descripción').fill('Ingreso E2E')
    await page.locator('.intuitive-transaction .save-btn').click()
    await expect(page.getByRole('status')).toContainText('Movimiento registrado')
  })

  await test.step('6. Registrar un gasto de Q50 en Comida', async () => {
    await page.locator('.form-type').getByRole('button', { name: /Gasto/ }).click()
    await page.getByLabel('Monto').fill('50')
    await page.locator('.quick-categories').getByRole('button', { name: /Comida/ }).click()
    await page.getByLabel('Descripción').fill('Alimentación E2E')
    await page.locator('.intuitive-transaction .save-btn').click()
    await expect(page.getByRole('status')).toContainText('Movimiento registrado')
  })

  await test.step('7. Ver movimientos en Finanzas', async () => {
    await page.locator('nav').getByRole('link', { name: 'Finanzas' }).click()
    await expect(page.getByRole('heading', { name: 'Tu dinero, claro y en orden' })).toBeVisible()
    await page.getByRole('link', { name: /Ver y editar movimientos/ }).click()
    await expect(page.getByText('Ingreso E2E', { exact: true })).toBeVisible()
    await expect(page.getByText('Alimentación E2E', { exact: true })).toBeVisible()
    await page.screenshot({ path: resolve(screenshotsDir, '03-finanzas-y-movimientos.png'), fullPage: true })
  })

  await test.step('8. Comprobar el balance e ingresos/gastos del dashboard', async () => {
    await page.locator('nav').getByRole('link', { name: 'Inicio' }).click()
    await expect(page.locator('[aria-label="Balance disponible"]')).toContainText('950')
    await expect(page.locator('.dashboard-month-row.income')).toContainText('1,000')
    await expect(page.locator('.dashboard-month-row.expense')).toContainText('50')
    await page.screenshot({ path: resolve(screenshotsDir, '04-dashboard-con-movimientos.png'), fullPage: true })
  })

  await test.step('9. Crear un presupuesto mensual', async () => {
    await page.locator('nav').getByRole('link', { name: 'Finanzas' }).click()
    await page.getByLabel('Categoría').selectOption({ label: 'Comida' })
    await page.getByLabel('Límite mensual').fill('200')
    await page.getByRole('button', { name: 'Guardar límite' }).click()
    await expect(page.locator('.account-notice')).toContainText('Límite mensual guardado')
    const progress = page.getByRole('progressbar', { name: 'Uso del límite de Comida' })
    await expect(progress).toHaveAttribute('aria-valuemax', '200')
    await expect(progress).toHaveAttribute('aria-valuenow', '50')
    await page.screenshot({ path: resolve(screenshotsDir, '05-presupuesto.png'), fullPage: true })
  })

  await test.step('10. Crear una meta y registrar un aporte', async () => {
    await page.locator('nav').getByRole('link', { name: 'Metas' }).click()
    await page.getByLabel('¿Para qué estás ahorrando?').fill('Fondo E2E')
    await page.getByLabel('Monto objetivo').fill('500')
    await page.getByRole('button', { name: 'Crear meta' }).click()
    await expect(page.getByRole('status')).toContainText('¡Meta creada!')
    const goal = page.locator('.goal-card').filter({ hasText: 'Fondo E2E' })
    await goal.getByRole('button', { name: /Agregar Q 100/ }).click()
    await expect(page.getByRole('status')).toContainText('Aporte de Q 100 agregado')
    await expect(goal).toContainText('20%')
    await page.screenshot({ path: resolve(screenshotsDir, '06-meta-con-aporte.png'), fullPage: true })
  })

  await test.step('12. Cerrar sesión y volver al flujo de autenticación', async () => {
    await closeSession(page)
    await page.goto('/metas')
    await expect(page).toHaveURL(/\/login$/)
    const authenticationView = page.getByRole('heading', { name: /Bienvenido de nuevo|Qué bueno verte de nuevo|YOUR MONEY\. YOUR MOVE\.|TUS FINANZAS/ })
    await expect(authenticationView).toBeVisible()
  })
})
async function closeSession(page: import('@playwright/test').Page) {
  const profileMenu = page.getByRole('button', { name: 'Abrir menú de perfil' })
  if (await profileMenu.count()) {
    await profileMenu.click()
    await page.getByRole('menuitem', { name: /Cerrar sesión/ }).click()
    return
  }
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
}
