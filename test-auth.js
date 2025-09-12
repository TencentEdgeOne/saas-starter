// 测试认证流程
const BASE_URL = 'http://localhost:3000'

async function testAuth() {
  console.log('🧪 开始测试认证流程...\n')

  // 1. 测试注册
  console.log('1️⃣ 测试用户注册...')
  try {
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      }),
    })

    const signupData = await signupResponse.json()
    console.log('注册响应:', signupResponse.status, signupData)
  } catch (error) {
    console.log('注册错误:', error.message)
  }

  // 2. 测试登录
  console.log('\n2️⃣ 测试用户登录...')
  try {
    const signinResponse = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    })

    const signinData = await signinResponse.json()
    console.log('登录响应:', signinResponse.status, signinData)

    // 获取 Cookie
    const cookies = signinResponse.headers.get('set-cookie')
    console.log('设置的 Cookie:', cookies)

    // 3. 测试获取用户信息
    console.log('\n3️⃣ 测试获取用户信息...')
    const userResponse = await fetch(`${BASE_URL}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Cookie': cookies || ''
      }
    })

    const userData = await userResponse.json()
    console.log('用户信息响应:', userResponse.status, userData)

  } catch (error) {
    console.log('登录/用户信息错误:', error.message)
  }

  // 4. 测试登出
  console.log('\n4️⃣ 测试用户登出...')
  try {
    const signoutResponse = await fetch(`${BASE_URL}/api/auth/signout`, {
      method: 'POST',
    })

    const signoutData = await signoutResponse.json()
    console.log('登出响应:', signoutResponse.status, signoutData)
  } catch (error) {
    console.log('登出错误:', error.message)
  }

  console.log('\n✅ 认证流程测试完成!')
}

// 运行测试
testAuth().catch(console.error)
