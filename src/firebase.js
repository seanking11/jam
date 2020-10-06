import firebase from 'firebase'

import config from './config'

firebase.initializeApp(config.firebase)
firebase.analytics()

export const functions = firebase.functions()

export default firebase
