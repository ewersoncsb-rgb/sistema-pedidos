import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, addDoc, collection, query, where, getDocs, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBD4a_2tjIVTQlRPwqpbvb2CPdq6D8630U",
  authDomain: "sistema-csb.firebaseapp.com",
  projectId: "sistema-csb",
  storageBucket: "sistema-csb.firebasestorage.app",
  messagingSenderId: "1022606421722",
  appId: "1:1022606421722:web:f5aae73a98e9fdd88affe3",
  measurementId: "G-TPRY15W3B7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Refs elementos
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const requestSection = document.getElementById("requestSection");
const adminSection = document.getElementById("adminSection");
const logoutBtn = document.getElementById("logoutBtn");

// Mostrar/ocultar telas
function showSection(section) {
  [loginSection, registerSection, requestSection, adminSection].forEach(s => s.classList.add("hidden"));
  section.classList.remove("hidden");
}

// Cadastro
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = regName.value;
  const email = regEmail.value;
  const pass = regPass.value;
  const clinic = regClinic.value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", cred.user.uid), { name, email, clinic, isAdmin: false });
    alert("Conta criada! Faça login.");
    showSection(loginSection);
  } catch (err) {
    alert("Erro no cadastro: " + err.message);
  }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPass.value);
  } catch (err) {
    alert("Erro no login: " + err.message);
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

// Sessão
onAuthStateChanged(auth, async user => {
  if (!user) {
    showSection(loginSection);
    logoutBtn.classList.add("hidden");
    return;
  }

  logoutBtn.classList.remove("hidden");

  const snap = await getDoc(doc(db, "users", user.uid));
  const udata = snap.data();

  if (udata.isAdmin) {
    showSection(adminSection);
    loadAllRequests();
  } else {
    showSection(requestSection);
    loadMyRequests(user.uid);
  }
});

// Criar pedido
document.getElementById("requestForm").addEventListener("submit", async e => {
  e.preventDefault();
  const user = auth.currentUser;
  const snap = await getDoc(doc(db, "users", user.uid));
  const udata = snap.data();

  const item = requestItem.value;
  const qty = Number(requestQty.value);

  await addDoc(collection(db, "requests"), {
    userId: user.uid,
    clinic: udata.clinic,
    item,
    qty,
    status: "Pendente",
    note: ""
  });

  alert("Pedido enviado!");
  loadMyRequests(user.uid);
});

// Carregar pedidos do usuário
async function loadMyRequests(uid) {
  const q = query(collection(db, "requests"), where("userId", "==", uid));
  const snap = await getDocs(q);
  const tbody = document.querySelector("#myRequestsTable tbody");
  tbody.innerHTML = "";
  snap.forEach(docu => {
    const r = docu.data();
    tbody.innerHTML += `<tr><td>${r.item}</td><td>${r.qty}</td><td>${r.status}</td><td>${r.note || ""}</td></tr>`;
  });
}

// Carregar pedidos admin
async function loadAllRequests() {
  const q = query(collection(db, "requests"));
  const snap = await getDocs(q);
  const tbody = document.querySelector("#allRequestsTable tbody");
  tbody.innerHTML = "";
  snap.forEach(docu => {
    const r = docu.data();
    tbody.innerHTML += `<tr><td>${r.clinic}</td><td>${r.item}</td><td>${r.qty}</td><td>${r.status}</td>
      <td>
        <button onclick="updateStatus('${docu.id}', 'Atendido')">Atender</button>
        <button onclick="updateStatus('${docu.id}', 'Parcial')">Parcial</button>
      </td></tr>`;
  });
}

window.updateStatus = async (id, status) => {
  await updateDoc(doc(db, "requests", id), { status });
  loadAllRequests();
};
