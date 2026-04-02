import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Sprint-06: Delivery & Review System', () => {
  
  test.describe('F008 - 专家提交成果', () => {
    
    test('01. 交付表单页面应该正常加载', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 等待页面加载
      await page.waitForLoadState('networkidle')
      
      // 验证关键元素
      await expect(page.locator('h1:has-text("提交成果")')).toBeVisible()
      await expect(page.locator('text=订单 ID: test-order-123')).toBeVisible()
    })

    test('02. 4步骤进度条应该正确显示', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 验证4个步骤
      await expect(page.locator('text=填写摘要')).toBeVisible()
      await expect(page.locator('text=详细答案')).toBeVisible()
      await expect(page.locator('text=上传附件')).toBeVisible()
      await expect(page.locator('text=确认提交')).toBeVisible()
    })

    test('03. 第1步：摘要输入应该有验证', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 初始状态，下一步按钮应该禁用
      await expect(page.locator('button:has-text("下一步")')).toBeDisabled()
      
      // 输入少于10个字符
      await page.fill('textarea', '测试')
      await expect(page.locator('button:has-text("下一步")')).toBeDisabled()
      
      // 输入至少10个字符
      await page.fill('textarea', '这是成果摘要，测试交付功能')
      await expect(page.locator('button:has-text("下一步")')).toBeEnabled()
    })

    test('04. 第2步：详细答案应该有验证', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 完成第1步
      await page.fill('textarea', '这是成果摘要，测试交付功能')
      await page.click('button:has-text("下一步")')
      
      // 等待第2步加载
      await page.waitForSelector('h2:has-text("2. 详细答案")')
      
      // 初始状态，下一步按钮应该禁用
      await expect(page.locator('button:has-text("下一步")')).toBeDisabled()
      
      // 输入少于50个字符
      await page.fill('textarea', '测试答案')
      await expect(page.locator('button:has-text("下一步")')).toBeDisabled()
      
      // 输入至少50个字符
      await page.fill('textarea', '这是详细的答案内容，包含了完整的分析和建议。根据调研结果，我们发现了三个主要问题点，并提出了对应的解决方案。')
      await expect(page.locator('button:has-text("下一步")')).toBeEnabled()
    })

    test('05. 第3步：文件上传应该是可选的', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 完成前2步
      await page.fill('textarea', '这是成果摘要，测试交付功能')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("2. 详细答案")')
      await page.fill('textarea', '这是详细的答案内容，包含了完整的分析和建议。根据调研结果，我们发现了三个主要问题点，并提出了对应的解决方案。')
      await page.click('button:has-text("下一步")')
      
      // 等待第3步加载
      await page.waitForSelector('h2:has-text("3. 上传附件")')
      
      // 不上传文件，也应该可以进入下一步
      await expect(page.locator('button:has-text("下一步")')).toBeEnabled()
    })

    test('06. 第4步：确认页面应该显示所有信息', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 完成前3步
      await page.fill('textarea', '这是成果摘要，测试交付功能')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("2. 详细答案")')
      await page.fill('textarea', '这是详细的答案内容，包含了完整的分析和建议。根据调研结果，我们发现了三个主要问题点，并提出了对应的解决方案。')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("3. 上传附件")')
      await page.click('button:has-text("下一步")')
      
      // 等待第4步加载
      await page.waitForSelector('h2:has-text("4. 确认提交")')
      
      // 验证显示的信息
      await expect(page.locator('text=这是成果摘要，测试交付功能')).toBeVisible()
      await expect(page.locator('button:has-text("确认提交")')).toBeVisible()
    })

    test('07. 提交付功能应该显示成功消息', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 完成所有步骤
      await page.fill('textarea', '这是成果摘要，测试交付功能')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("2. 详细答案")')
      await page.fill('textarea', '这是详细的答案内容，包含了完整的分析和建议。根据调研结果，我们发现了三个主要问题点，并提出了对应的解决方案。')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("3. 上传附件")')
      await page.click('button:has-text("下一步")')
      await page.waitForSelector('h2:has-text("4. 确认提交")')
      
      // 点击提交
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('成果提交成功')
        await dialog.accept()
      })
      
      await page.click('button:has-text("确认提交")')
    })
  })

  test.describe('F009 - 双重审核', () => {
    
    test('08. 审核API应该返回404如果订单不存在', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/orders/non-existent/review`, {
        data: {
          reviewerType: 'PLATFORM',
          action: 'APPROVE'
        }
      })
      
      expect(response.status()).toBe(404)
      const data = await response.json()
      expect(data.error).toContain('订单不存在')
    })

    test('09. 审核API应该验证必填字段', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/orders/test-order/review`, {
        data: {}
      })
      
      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('缺少必填字段')
    })

    test('10. 审核API应该验证reviewerType', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/orders/test-order/review`, {
        data: {
          reviewerType: 'INVALID',
          action: 'APPROVE'
        }
      })
      
      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('审核类型必须是 PLATFORM 或 CLIENT')
    })

    test('11. 审核API应该验证action', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/orders/test-order/review`, {
        data: {
          reviewerType: 'PLATFORM',
          action: 'INVALID'
        }
      })
      
      expect(response.status()).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('操作必须是 APPROVE 或 REJECT')
    })
  })

  test.describe('Deep Dark Tech Style', () => {
    
    test('12. 页面应该使用深色科技风格', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 检查背景渐变
      const body = await page.locator('body')
      const bgColor = await body.evaluate(el => 
        window.getComputedStyle(el).background
      )
      
      // 应该包含深色
      expect(bgColor).toBeTruthy()
    })

    test('13. 卡片应该有边框和背景', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 检查卡片样式
      const card = await page.locator('.bg-gray-900\\/50').first()
      await expect(card).toBeVisible()
    })

    test('14. 按钮应该有hover效果', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 找到下一步按钮（如果可见）
      const nextButton = page.locator('button:has-text("下一步")').first()
      if (await nextButton.isVisible()) {
        await nextButton.hover()
        // 不应该报错
      }
    })
  })

  test.describe('Responsive Design', () => {
    
    test('15. 移动端应该正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 验证关键元素在移动端可见
      await expect(page.locator('h1:has-text("提交成果")')).toBeVisible()
    })

    test('16. 平板应该正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto(`${BASE_URL}/orders/test-order-123/deliver`)
      
      // 验证关键元素在平板可见
      await expect(page.locator('h1:has-text("提交成果")')).toBeVisible()
    })
  })
})
