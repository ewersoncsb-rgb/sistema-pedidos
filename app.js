// Importando Firebase (versão modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD4a_2tjIVTQlRPwqpbvb2CPdq6D8630U",
  authDomain: "sistema-csb.firebaseapp.com",
  projectId: "sistema-csb",
  storageBucket: "sistema-csb.firebasestorage.app",
  messagingSenderId: "1022606421722",
  appId: "1:1022606421722:web:f5aae73a98e9fdd88affe3",
  measurementId: "G-TPRY15W3B7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Função de Login
async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    alert("Login realizado com sucesso!");
    mostrarAba("fazerPedido");
  } catch (error) {
    alert("Erro no login: " + error.message);
  }
}

// Função de Cadastro
async function cadastrar() {
  const email = document.getElementById("cadastroEmail").value;
  const senha = document.getElementById("cadastroSenha").value;

  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Cadastro realizado com sucesso!");
    mostrarAba("loginCadastro");
  } catch (error) {
    alert("Erro no cadastro: " + error.message);
  }
}

// Logout
async function logout() {
  try {
    await signOut(auth);
    alert("Você saiu da conta.");
    mostrarAba("loginCadastro");
  } catch (error) {
    alert("Erro ao sair: " + error.message);
  }
}

// Mostrar abas
function mostrarAba(aba) {
  const abas = document.querySelectorAll(".aba");
  abas.forEach(div => div.style.display = "none");

  document.getElementById(aba).style.display = "block";
}

// Mostrar aba de cadastro
function mostrarCadastro() {
  mostrarAba("cadastro");
}

// Expor funções para o HTML
window.login = login;
window.cadastrar = cadastrar;
window.logout = logout;
window.mostrarAba = mostrarAba;
window.mostrarCadastro = mostrarCadastro;
