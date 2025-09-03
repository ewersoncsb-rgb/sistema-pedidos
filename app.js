// Importando Firebase (versão modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários
    match /users/{userId} {
      // Cada usuário só pode ler/editar o próprio perfil
      allow read, update: if request.auth != null && request.auth.uid == userId;
      // Admin pode ler todos os perfis
      allow read: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      // Criação de conta feita pelo sistema (auth já cuida do cadastro)
      allow create: if request.auth != null;
    }

    // Itens (almoxarifado)
    match /items/{itemId} {
      // Apenas admin pode gerenciar o estoque
      allow read: if request.auth != null; // todos podem visualizar
      allow create, update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Pedidos
    match /requests/{requestId} {
      // Usuário pode criar pedidos e ver apenas os próprios
      allow create: if request.auth != null;
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      // Admin pode atualizar status (atendido, etc.)
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
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
