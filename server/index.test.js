import { insertTestUser, getToken } from './helpers/test.js'

const base_url = 'http://localhost:3001' 

import { expect } from 'chai'


describe('DELETE user',() => {
  const email = 'post@foo.com'
  const password = 'post123'
  insertTestUser(email,password)
  const token = getToken(email)
  it ('should delete a user',async() => {
    const response = await fetch(base_url + '/delete/',{
      method: 'delete',
      headers: {
        Authorization: token
      }
    })
    const data = await response.json()
    expect(response.status).to.equal(200,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id')
  })

  it ('should not delete a task with SQL injection',async() => {
    const response = await fetch(base_url + '/delete/id=0 or id > 0',{
      method: 'delete',
      headers: {
        Authorization: token
      }
    })
    const data = await response.json()
    expect(response.status).to.equal(500,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('error')
  })
})

describe('POST register',() => {
  const email = 'register@foo.com'
  const password = 'register123'
  it ('should register with valid email and password',async() => {
    const response = await fetch(base_url + '/user/register',{
      method: 'post',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({'email':email,'password':password})
    })
    const data = await response.json()
    expect(response.status).to.equal(201,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id','email')
  })

  it ('should not post a user with less than 8 character password',async () => {
    const email = 'register@foo.com'
    const password = 'short1'
    const response = await fetch(base_url + '/user/register',{
      method: 'post',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({'email':email,'password':password})
    })
    const data = await response.json()
    expect(response.status).to.equal(400,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('error')
  })
})

describe('POST login',() => {
  const email = 'login@foo.com'
  const password = 'login123'
  insertTestUser(email,password)
  it ('should login with valid credentials',async() => {
    const response = await fetch(base_url + '/user/login',{
      method: 'post',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({'email':email,'password':password})
    })
    const data = await response.json()
    expect(response.status).to.equal(200,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('id','email','token')
  })

  it ('should not login with invalid credentials',async () => {
    const email = 'login@foo.com'
    const password = 'wrongpassword'
    const response = await fetch(base_url + '/user/login',{
      method: 'post',
      headers: {
        'Content-Type':'application/json'
      },
      body: JSON.stringify({'email':email,'password':password})
    })
    const data = await response.json()
    expect(response.status).to.equal(401,data.error)
    expect(data).to.be.an('object')
    expect(data).to.include.all.keys('error')
  })
})