const baseUrl = "http://127.0.0.1:3333";

function abrirPopupPedidoCarona() {
  const popupPedidoCarona = document.getElementById("pedidoCaronaPopup");
  popupPedidoCarona.style.display = "block";
}

function fecharPopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.style.display = "none";
}

function pedirCarona() {
  const pedirCaronaForm = document.getElementById("pedirCaronaForm");
  const formData = new FormData(pedirCaronaForm);

  fetch(`${baseUrl}/pedirCarona`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.status) {
        alert("Carona solicitada com sucesso! Agora é só aguardar!");
        fecharPopup("pedidoCaronaPopup");
        return verCaronas();
      }
      alert(data.content.message);
    })
    .catch((error) => console.error(error));
}

function oferecerCarona(passageiroId) {
  const popup = document.getElementById("oferecerCaronaPopup");
  popup.style.display = "block";
  popup.dataset.passageiroId = passageiroId;
}

function confirmarOfertaCarona() {
  const passageiroId = document.getElementById("oferecerCaronaPopup").dataset
    .passageiroId;
  const nomeMotorista = document.getElementById("nomeMotorista").value;
  const celularMotorista = document.getElementById("celularMotorista").value;

  fetch(`${baseUrl}/ofertarCarona`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      passageiroId: passageiroId,
      nome: nomeMotorista,
      celular: celularMotorista,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.content.status) {
        alert("Grato pela solidariedade. Sua oferta de carona foi confirmada!");
        fecharPopup("oferecerCaronaPopup");
        return verCaronas();
      }
      alert(data.content.message);
    })
    .catch((error) => console.error(error));
}

function verCaronas() {
  const caronasTableBody = document.querySelector("#caronasTable tbody");

  fetch(`${baseUrl}/verCaronas`)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.content)) {
        caronasTableBody.innerHTML = "";

        data.content.forEach((carona) => {
          const row = caronasTableBody.insertRow();

          row.insertCell(0).textContent = carona.nome;
          row.insertCell(1).textContent = carona.numvagas;
          row.insertCell(2).textContent = carona.bairro;
          row.insertCell(3).textContent = carona.cidade;
          row.insertCell(4).textContent = carona.celular;
          row.insertCell(5).textContent = carona.motoristanome;
          row.insertCell(6).textContent = carona.motoristacelular;
          if (!carona.motoristanome) {
            row.classList.add("semMotorista");
          } else {
            row.classList.add("comMotorista");
          }
          row.addEventListener("click", () => {
            if (carona.motoristanome) {
              alert("ATENÇÃO: ESTA PESSOA JÁ POSSUI CARONA!!");
              alert(
                "ATENÇÃO: Como esta pessoa já possui uma carona programada, ao oferecer carona a esta pessoa, a carona anterior será cancelada!!"
              );
            }
            oferecerCarona(carona.id);
          });
        });
      } else {
        console.error("O servidor não retornou um array de caronas.");
      }
    })
    .catch((error) => console.error(error));
}
