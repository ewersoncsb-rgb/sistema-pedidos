// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Configuração Firebase (use suas credenciais reais)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT_ID.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT_ID.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Controle de abas
window.mostrarAba = function(id) {
  document.querySelectorAll('.aba').forEach(a => a.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
};

// Login
window.login = async function() {
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, senha);
    alert('Login realizado com sucesso!');
    document.getElementById('logoutBtn').classList.remove('hidden');
    verificarAdmin(email);
    mostrarAba('pedido');
    carregarPedidosUsuario(email);
    carregarPedidosAdmin();
  } catch (e) {
    alert('Erro no login: ' + e.message);
  }
};

// Cadastro
window.cadastrar = async function() {
  const nome = document.getElementById('cadastroNome').value;
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;
  const consultorio = document.getElementById('cadastroConsultorio').value;
  try {
    await createUserWithEmailAndPassword(auth, email, senha);
    alert('Cadastro realizado com sucesso! Faça login.');
    mostrarAba('login');
  } catch (e) {
    alert('Erro no cadastro: ' + e.message);
  }
};

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await signOut(auth);
  alert('Logout realizado');
  document.getElementById('logoutBtn').classList.add('hidden');
  mostrarAba('login');
});

// Fazer pedido
window.fazerPedido = async function() {
  const item = document.getElementById('pedidoItem').value;
  const qtd = document.getElementById('pedidoQtd').value;
  const obs = document.getElementById('pedidoObs').value;
  const user = auth.currentUser;
  if (!user) return alert('Faça login');
  try {
    await addDoc(collection(db, 'pedidos'), {
      item, qtd, obs, email: user.email, status: 'Pendente', justificativa: ''
    });
    alert('Pedido enviado');
    carregarPedidosUsuario(user.email);
    carregarPedidosAdmin();
  } catch (e) {
    alert('Erro ao enviar pedido: ' + e.message);
  }
};

// Verifica se usuário é admin
function verificarAdmin(email) {
  const adminEmail = "admin@clinica.test"; // ajuste conforme seu Firebase
  document.querySelectorAll('.adminOnly').forEach(el => {
    if (email === adminEmail) el.classList.remove('hidden');
    else el.classList.add('hidden');
  });
}

// Carregar pedidos do usuário
async function carregarPedidosUsuario(email) {
  const q = query(collection(db, 'pedidos'), where('email', '==', email));
  const snap = await getDocs(q);
  const tbody = document.getElementById('minhaListaPedidos');
  tbody.innerHTML = '';
  snap.forEach(docSnap => {
    const p = docSnap.data();
    tbody.innerHTML += `<tr><td>${p.item}</td><td>${p.qtd}</td><td>${p.status}</td><td>${p.justificativa || ''}</td></tr>`;
  });
}

// Carregar pedidos para admin
async function carregarPedidosAdmin() {
  const tbody = document.getElementById('listaPedidosAdmin');
  if (!tbody) return;
  const snap = await getDocs(collection(db, 'pedidos'));
  tbody.innerHTML = '';
  snap.forEach(docSnap => {
    const p = docSnap.data();
    tbody.innerHTML += `<tr>
      <td>${p.email}</td><td>${p.item}</td><td>${p.qtd}</td><td>${p.status}</td>
      <td>
        <button onclick="atualizarPedido('${docSnap.id}','Atendido')">Atendido</button>
        <button onclick="atualizarPedido('${docSnap.id}','Parcialmente','Necessário aguardar')">Parcial</button>
      </td>
    </tr>`;
  });
}

// Atualizar pedido (Admin)
window.atualizarPedido = async function(id, status, justificativa='') {
  const ref = doc(db, 'pedidos', id);
  await updateDoc(ref, { status, justificativa });
  alert('Pedido atualizado');
  carregarPedidosAdmin();
};
