import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "SUA_APIKEY",
  authDomain: "sistema-csb.firebaseapp.com",
  projectId: "sistema-csb",
  storageBucket: "sistema-csb.appspot.com",
  messagingSenderId: "1022606421722",
  appId: "1:1022606421722:web:f5aae73a98e9fdd88affe3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function mostrarAba(aba) {
  document.querySelectorAll(".aba").forEach(div => div.classList.add("d-none"));
  document.querySelector(`#aba-${aba}`).classList.remove("d-none");
}
window.mostrarAba = mostrarAba;

async function cadastrar() {
  const email = document.getElementById("cadastroEmail").value;
  const senha = document.getElementById("cadastroSenha").value;
  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert("Usuário cadastrado!");
  } catch (e) {
    alert("Erro: " + e.message);
  }
}
window.cadastrar = cadastrar;

async function login() {
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  try {
    await signInWithEmailAndPassword(auth, email, senha);
    alert("Login realizado!");
    document.getElementById("logoutBtn").classList.remove("d-none");
    mostrarAba("pedido");
  } catch (e) {
    alert("Erro: " + e.message);
  }
}
window.login = login;

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  alert("Saiu da conta!");
  mostrarAba("login");
});

async function fazerPedido() {
  const item = document.getElementById("pedidoItem").value;
  const quantidade = document.getElementById("pedidoQtd").value;
  const consultorio = document.getElementById("pedidoConsultorio").value;

  try {
    await addDoc(collection(db, "orders"), {
      item, quantidade, consultorio,
      status: "Pendente",
      data: new Date().toLocaleString()
    });
    alert("Pedido enviado!");
    carregarMeusPedidos();
  } catch (e) {
    alert("Erro ao enviar pedido: " + e.message);
  }
}
window.fazerPedido = fazerPedido;

async function carregarMeusPedidos() {
  const tbody = document.getElementById("tabelaMeusPedidos");
  tbody.innerHTML = "";
  const q = query(collection(db, "orders"));
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    const p = doc.data();
    tbody.innerHTML += `
      <tr>
        <td>${p.data}</td>
        <td>${p.item}</td>
        <td>${p.quantidade}</td>
        <td>${p.consultorio}</td>
        <td>${p.status}</td>
      </tr>
    `;
  });
}
window.carregarMeusPedidos = carregarMeusPedidos;