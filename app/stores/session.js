import { defineStore } from "pinia"
import { toast } from "vue-sonner"
import { $api } from "~/utils/plain-fetch"

export const useSessionStore = defineStore('session', () => {
  const session = ref(null)
  // const toast = useToastService()
  const loading = ref(false)

  const login = async (credentials) => {
    const { username, password } = credentials
    loading.value = true
    let token = ''
    try {
      const { setToken } = useNuxtApp().$authCookie
      const response = await $api('/login', {
        method: 'POST',
        body: { username, password },
        onResponse: ({ response }) => {
          // if (response.headers.get('Authorization')) {
          //   token = response.headers.get('Authorization')?.replace('Bearer ', '')
          //   setToken(token)
          // }
          if (response._data?.token) {
            token = response._data.token
            setToken(token)
          }

        }
      })
      session.value = response
      toast.success('Sesión iniciada correctamente')
      // toast.add({
      //   severity: 'success',
      //   summary: 'Sesión',
      //   detail: 'Sesión iniciada correctamente',
      //   life: 3000
      // })

      navigateTo('/admin/home')

      return response
    } catch (error) {
      toast.error(error.data?.message ?? error.name, {})
      // console.log('Error al iniciar sesión:', error)
      return {
        error: error.data.message ?? error.name
      }
    } finally {
      loading.value = false
    }
  }

  const updatePassword = async (newPassword) => {
    loading.value = true
    try {
      const response = await $api('/auth/password', {
        method: 'PATCH',
        body: { password: newPassword }
      })
      // toast.add({
      //   severity: 'success',
      //   summary: 'Contraseña',
      //   detail: 'Contraseña actualizada correctamente',
      //   life: 3000
      // })
      return response
    } catch (error) {
      // toast.add({
      //   severity: 'error',
      //   summary: 'Contraseña',
      //   detail: error.data.message ?? error.name,
      //   life: 3000
      // })
      return {
        error: error.data.message
      }
    } finally {
      loading.value = false
    }
  }

  const recoverSession = async () => {
    loading.value = true
    try {
      const { getToken } = useNuxtApp().$authCookie
      if (!getToken()) return

      const response = await $api('/users/me')
      session.value = response
      return response
    } catch (error) {
      // toast.add({
      //   severity: 'error',
      //   summary: 'Sesión',
      //   detail: 'No se pudo recuperar la sesión. Intenta iniciar sesión nuevamente',
      //   life: 3000
      // })
      return {
        error: error.data?.message ?? error.name
      }
    } finally {
      loading.value = false
    }


    // const userData = localStorage.getItem('userData')
    // if (userData) {
    //   session.value = JSON.parse(userData)
    // }
  }

  const fetchUserData = async () => {
    loading.value = true
    try {
      const response = await $api('/me')
      session.value = response
      return response
    } catch (error) {
      return {
        error: error.data.message
      }
    } finally {
      loading.value = false
    }
  }

  const role = computed(() => {
    return session.value?.role
  })

  const roleDisplay = computed(() => {
    switch (role.value) {
      case 'admin':
        return 'Administrador'
      case 'employee':
        return 'Empleado'
    }
  })

  const logout = () => {
    // todo: call to logout endpoint
    navigateTo('/admin/login')
    session.value = null
    const { removeToken } = useNuxtApp().$authCookie
    removeToken()
    // toast.add({
    //   severity: 'success',
    //   summary: 'Sesión',
    //   detail: 'Sesión cerrada correctamente',
    //   life: 3000
    // })
  }

  return {
    session,
    loading,
    login,
    logout,
    recoverSession,
    updatePassword,
    fetchUserData,
    role,
    roleDisplay,
  }
})