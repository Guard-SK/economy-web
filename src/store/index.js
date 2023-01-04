import { createStore } from 'vuex'

// firebase
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'


export default createStore({
  state: {
    user: null
  },
  getters: {
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      console.log('user state changed:', state.user)
    }
  },
  actions: {
    async signUp(context, {email, password}) {
      console.log('signup action')
      const res = await createUserWithEmailAndPassword(auth, email, password)
      if (res) {
        context.commit('setUser', res.user)
      } else {
        throw new Error('could not somplete signup')
      }
    },
    async login(context, {email, password}) {
      console.log('login action')
      const res = await signInWithEmailAndPassword(auth, email, password)
      if (res) {
        context.commit('setUser', res.user)
        console.log(auth.currentUser.id)
      } else {
        throw new Error('could not somplete login')
      }
    },
  },
  modules: {
  }
})

