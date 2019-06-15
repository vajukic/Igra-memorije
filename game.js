var ime_igraca = document.getElementById('ime');
var igrac = document.getElementById('igrac');
var nova_igra = document.getElementById('nova_igra');
var vreme = document.getElementById('vreme');
var divNaVrhu = document.getElementById('divNaVrhu');

var poeni = document.getElementById('poeni');
var time_limit = document.getElementById('sekunde');
var imeFoldera;
var zadato_vreme;
var preostalo_vreme;
var xMax;
var yMax;
var nivo;

//Funkcija iz koje izvlačim informacije o dimenzijama table
function izaberiTezinu() {
    nivo = document.querySelector('input[name="nivo"]:checked').value;

    switch (nivo) {
        case "lako":
            xMax = 3;
            yMax = 2;
            break;
        case "srednje":
            xMax = 4;
            yMax = 4;
            break;
        case "teško":
            xMax = 5;
            yMax = 6;
            break;
    }

    if (nivo.length > 0) nova_igra.disabled = false;
    else
        nova_igra.disabled = true;
    console.log(xMax);
    console.log(yMax);
}

// Izvlačim informacije o skupu slika sa kojim korisnik želi da se igra.
// Izabranu vrednost iz select liste smeštam u promenljivu imeFoldera
function izaberiSetSlika() {
    var e = document.getElementById("setSlika");
    imeFoldera = e.options[e.selectedIndex].value;
}

ime_igraca.addEventListener('input', promeniIme);
time_limit.addEventListener('input', izaberiVremenskiLimit);
// Sadrzaj tekstualnih polja je promenjen, upisuje se ime igraca i preostalo vreme
// Kada se klikne na dugme, poziva se nekoliko funkcija
nova_igra.addEventListener('click', () => {
    izaberiTezinu();
    izaberiSetSlika();
    novaIgra();
});

// Dugme za pocetak igre je onesposobljeno
nova_igra.disabled = true;

var matrica;

// Na pocetku...
var igra_u_toku = 0;

var prva_kartica;
var druga_kartica;

var broj_poena;
var dozvoljen_potez = 0;

var preostalo_polja;

function izaberiVremenskiLimit() {
    zadato_vreme = parseInt(this.value);
    console.log(zadato_vreme);
}

if (zadato_vreme == undefined)
    vreme, innerHTML = "";
else
    vreme.innerHTML = zadato_vreme;


function promeniIme() {
    // Vrednost unetog polja upisujem kao sadrzaj elementa <strong id="igrac"></strong>
    igrac.innerHTML = (this.value.trim()).toUpperCase();
}


function novaIgra() {
    console.log(nivo);
    if (nivo == 0) alert("Molim te, izaberi nivo!");
    else {
        if (!Number.isInteger(zadato_vreme) || zadato_vreme < 0)
            alert("Molim te, unesi validan broj sekundi!");
        else {
            preostalo_vreme = zadato_vreme;
            preostalo_polja = xMax * yMax;
            dozvoljen_potez = 1;
            broj_poena = 0;
            poeni.innerHTML = 0;
            nova_igra.disabled = true;
            igra_u_toku = 1;
            prva_kartica = undefined;
            druga_kartica = undefined;

            inicijalizujMatricu();
            nacrtajTablu();
            pokreniTajmer();
        }
    }
}

function pokreniTajmer() {
    console.log(preostalo_vreme);
    if (igra_u_toku == 0)
        return;

    vreme.innerHTML = preostalo_vreme;

    if (preostalo_vreme != 0) {
        preostalo_vreme--;
        console.log(preostalo_vreme);

        setTimeout(pokreniTajmer, 1000);
    } else {
        alert("KRAJ IGRE \nNa žalost, vreme je isteklo!");
        igra_u_toku = 0;
        nova_igra.disabled = false;
    }
}

function nacrtajTablu() {
    var i, j;
    console.log("xMax = " + xMax, "yMax = " + yMax);
    divNaVrhu.innerHTML = "";

    for (i = 0; i < xMax; i++) {
        for (j = 0; j < yMax; j++) {
            polje = document.createElement('div');
            polje.setAttribute('class', 'polje');

            //postavljam širinu svake kartice tako što 100% delim sa brojem kartica u jednoj vrsti od koga oduzimam po 2% širine margine
            polje.style.flexBasis = `${100 / xMax - 4}%`;

            kartica = document.createElement('img');
            kartica.setAttribute('src', 'images/back.png');
            kartica.setAttribute('data-okrenuta', 0);
            kartica.setAttribute('data-broj', matrica[i][j]);
            console.log(kartica);
            kartica.style.transition = '0.3s';
            kartica.style.transformStyle = 'preserve-3d';

            kartica.addEventListener('click', okreniKarticu);
            kartica.addEventListener('mouseover', prikaziSenku);
            kartica.addEventListener('mouseleave', skloniSenku);

            divNaVrhu.classList.add('tabla');

            polje.appendChild(kartica);

            divNaVrhu.appendChild(polje);
        }
    }
}

function okreniKarticu() {

    if (igra_u_toku == 1 && dozvoljen_potez == 1 && this.getAttribute('data-okrenuta') == 0) {


        this.setAttribute('src', 'images/' + imeFoldera + '/' + this.getAttribute('data-broj') + '.png');
        this.setAttribute('data-okrenuta', 1);

        if (prva_kartica == undefined) {
            prva_kartica = this;
        } else {
            druga_kartica = this;
            if (prva_kartica.getAttribute('data-broj') == druga_kartica.getAttribute('data-broj')) {

                broj_poena += 10;
                poeni.innerHTML = broj_poena;

                prva_kartica = undefined;
                druga_kartica = undefined;

                preostalo_polja -= 2;

                if (preostalo_polja == 0) {
                    igra_u_toku = 0;
                    nova_igra.disabled = false;
                    setTimeout(() => alert("POBEDA! \nSpojenih parova: " + broj_poena / 10 +
                        "\nza: " + (zadato_vreme - preostalo_vreme - 1) + " sekunde"), 300);
                }
            } else {
                dozvoljen_potez = 0;
                setTimeout(function() {

                    prva_kartica.setAttribute('data-okrenuta', 0);
                    druga_kartica.setAttribute('data-okrenuta', 0);

                    prva_kartica.setAttribute('src', 'images/back.png');
                    druga_kartica.setAttribute('src', 'images/back.png');

                    prva_kartica = undefined;
                    druga_kartica = undefined;
                    dozvoljen_potez = 1;
                }, 1000);
            }
        }
    }
}


function inicijalizujMatricu() {

    matrica = [];
    for (i = 0; i < xMax; i++) {
        matrica[i] = [];
        for (j = 0; j < yMax; j++) {
            matrica[i][j] = 0;
        }
    }

    var i1, j1, i2, j2;
    for (var k = 1; k <= xMax * yMax / 2; k++) {
        do {
            i1 = Math.random();
            i1 = Math.trunc(i1 * 100) % xMax;

            j1 = Math.random();
            j1 = Math.trunc(j1 * 100) % yMax;

        } while (matrica[i1][j1] != 0)

        matrica[i1][j1] = k;
        do {
            i2 = Math.random();
            i2 = Math.trunc(i2 * 100) % xMax;

            j2 = Math.random();
            j2 = Math.trunc(j2 * 100) % yMax;
        } while (matrica[i2][j2] != 0)

        matrica[i2][j2] = k;
    }
    console.log(matrica);
}

function prikaziSenku() {
    this.style.boxShadow = '0px 0px 15px 3px white';
}

function skloniSenku() {
    this.style.boxShadow = 'none';
}

//Menjanje boje pozadine
var dugmeBoja = document.getElementById("dugmeBoja");
dugmeBoja.onclick = function() {
    var boje = ["AliceBlue", "Bisque", "GreenYellow", "LightSkyBlue", "RosyBrown ", "lLightGoldenRodYellow"];
    var odabranaBoja = Math.floor(Math.random() * boje.length);
    document.body.style.backgroundColor = boje[odabranaBoja];
    dugmeBoja.style.backgroundColor = boje[odabranaBoja];
}