// Importando Firebase (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 Configuração Firebase (cole suas credenciais aqui)
const firebaseConfig = {
  apiKey: "AIzaSyBD4a_2tjIVTQlRPwqpbvb2CPdq6D8630U",
  authDomain: "sistema-csb.firebaseapp.com",
  projectId: "sistema-csb",
  storageBucket: "sistema-csb.firebasestorage.app",
  messagingSenderId: "1022606421722",
  appId: "1:1022606421722:web:f5aae73a98e9fdd88affe3",
  measurementId: "G-TPRY15W3B7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Funções de login e cadastro
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

async function logout() {
  try {
    await signOut(auth);
    alert("Você saiu da conta.");
    mostrarAba("loginCadastro");
  } catch (error) {
    alert("Erro ao sair: " + error.message);
  }
}

// Controle das abas
function mostrarAba(aba) {
  const abas = document.querySelectorAll(".aba");
  abas.forEach(div => div.style.display = "none");
  document.getElementById(aba).style.display = "block";
}

function mostrarCadastro() {
  mostrarAba("cadastro");
}

// Expor funções para o HTML
window.login = login;
window.cadastrar = cadastrar;
window.logout = logout;
window.mostrarAba = mostrarAba;
window.mostrarCadastro = mostrarCadastro;
