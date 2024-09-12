'use client'
import { useState, useEffect } from 'react'
import { User } from "@/models/User"
import {axiosInstance} from '@/tools/api'
import { AxiosResponse } from 'axios'



export default function AssistantPage() {
  async function createUser(formData: FormData){

    const rawData = {
      username: formData.get('username'),
      password: formData.get('password')
    }
    
    await axiosInstance.post('/user/create', rawData)
  }

  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      const response: AxiosResponse = await axiosInstance.get('/user/list')
      const users = response.data

      setUsers(users)
    }
    fetchUsers()
  }, [])

  return (
    <><h1>Assistant</h1>
      <ul>
        {users.map((user: User) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
      
      <form action={createUser}>
        <input name="username" placeholder="Usuario"></input>
        <input name="password" placeholder="Contraseña"></input>
        <input type="submit" />
      </form>
    </>
  )
}