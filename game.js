var ime_igraca = document.getElementById('ime');
var igrac = document.getElementById('igrac');
var nova_igra = document.getElementById('nova_igra');
var vreme = document.getElementById('vreme');
// var tabla = document.getElementById('tabla');
var divNaVrhu = document.getElementById('divNaVrhu');
console.log(divNaVrhu);
var poeni = document.getElementById('poeni');
var imeFoldera;
var xMax;
var yMax;

//Funkcija iz koje izvlačim informacije o dimenzijama table
function izaberiTezinu() {
    var nivo = document.querySelector('input[name="nivo"]:checked').value;

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

ime_igraca.addEventListener('input', promeniIme); // Sadrzaj tekstualnog polja je promenjen, poziva se funkcija promeniIme
// Kada se klikne na dugme, poziva se nekoliko funkcija i dodaje se nova klasa 
nova_igra.addEventListener('click', () => {
    izaberiTezinu();
    izaberiSetSlika();
    novaIgra();
    divNaVrhu.classList.add('tabla');
    // divNaVrhu.className += 'tabla';

});
// Dugme za pocetak igre je onesposobljeno
nova_igra.disabled = true;

// Matrica koja ce predstavljati raspored kartica, elementi matrice su 0 ako je polje prazno,
// brojevi od 1 do 8 ce odgovarati rednim brojevima kartica koje ce se naci na poljima
var matrica;

// Indikator koji oznacava da li je igra u toku
var igra_u_toku = 0;

// Promenljive koje ce cuvati elemente koji predstavljaju prvu i drugu odabranu karticu
var prva_kartica;
var druga_kartica;

// Promenljiva koja cuva broj osvojenih poena
var broj_poena;

// Indikator koji odredjuje da li je dozvoljeno okretanje kartica
var dozvoljen_potez = 0;

// Promenljiva koja cuva broj koliko je polja ostalo neotvorenih
var preostalo_polja;

// Promenljiva koja cuva preostali broj sekundi do kraja igre 
var preostalo_vreme = 60;
vreme.innerHTML = preostalo_vreme;

// Promena imena
function promeniIme() {
    // Vrednost unetog polja upisujem kao sadrzaj elementa <strong id="igrac"></strong>
    igrac.innerHTML = this.value.trim();
}

function novaIgra() {

    // document.getElementById("tabla").style.zIndex = "1";
    // Inicijalizacija parametara igre
    preostalo_polja = xMax * yMax;
    dozvoljen_potez = 1;

    broj_poena = 0;
    poeni.innerHTML = 0;

    nova_igra.disabled = true;
    igra_u_toku = 1;
    preostalo_vreme = 60;

    // Undefined je neodredjena vrednost, sluzi kao indikator da vrednost nije dodeljena
    prva_kartica = undefined;
    druga_kartica = undefined;

    inicijalizujMatricu();

    nacrtajTablu();

    pokreniTajmer();
}


// Funkcija koja je zaduzena za racunanje i prikaz vremena
function pokreniTajmer() {
    // Ako je igra zavrsena, tajmer se zaustavlja
    if (igra_u_toku == 0)
        return;

    // Preostalo vreme do kraja igre se upisuje kao sadrzaj elementa <strong id="vreme"></strong> 
    vreme.innerHTML = preostalo_vreme;

    // Ako vreme nije isteklo...
    if (preostalo_vreme != 0) {
        preostalo_vreme--; // Smanjuje se broj sekundi do kraja

        // Funkcija tajmer poziva funkciju navedenu kao prvi argument,
        // u ovom slucaju poziva ponovo funkciju zaduzenu za tajmer, nakon broja milisekundi,
        // koji je naveden kao drugi argument. U konkretnom slucaju, pozivamo funkciju koja odbrojava
        // vreme do kraja svakih 1000 ms = 1s.
        setTimeout(pokreniTajmer, 1000);
    } else // Ako vreme jeste isteklo...
    {
        alert("KRAJ IGRE \nNa žalost, vreme je isteklo!");
        igra_u_toku = 0;
        nova_igra.disabled = false;
    }
}


// Funkcija koja crta tablu sa karticama
function nacrtajTablu() {
    // Brojaci
    var i, j;
    console.log("xMax = " + xMax, "yMax = " + yMax);

    // Eventualni table se brise
    // tabla.innerHTML = "";
    divNaVrhu.innerHTML = "";

    // Tabla se popunjava karticama
    for (i = 0; i < xMax; i++) {

        for (j = 0; j < yMax; j++) {

            // Pravljenje novog elementa div sa klasom polje
            polje = document.createElement('div');
            polje.setAttribute('class', 'polje');
            polje.style.flexBasis = (100 / xMax - 2) + "%";
            polje.style.flexBasis = `${100 / xMax - 2}%`;


            // Pravljenje novog elementa img sa vrednostima atributa:
            // src="images/back.png", data-okrenuta="0" data-broj="Element matrice na poziciji i,j."            
            kartica = document.createElement('img');
            kartica.setAttribute('src', 'images/back.png');
            kartica.setAttribute('data-okrenuta', 0);
            kartica.setAttribute('data-broj', matrica[i][j]);
            console.log(kartica);
            kartica.style.transition = '0.3s';

            // Dodavanje dogadjaja vezanih za kartice
            kartica.addEventListener('click', okreniKarticu); // Klik na karticu
            kartica.addEventListener('mouseover', prikaziSenku); // Prelaz kursora preko kartice
            kartica.addEventListener('mouseleave', skloniSenku); // Izlazak kursora sa kartice


            // Elementu div sa klasom polje dodeljujemo sin cvor sa slikom
            polje.appendChild(kartica);

            // Dodajemo div sa karticom elementu tabla.
            // tabla.appendChild(polje);
            divNaVrhu.appendChild(polje);
        }
    }
}

// Funkcija kojom se obradjuje odabir kartice
function okreniKarticu() {
    // console.log (this);
    // Karticu je moguce okrenuti ako je igra u toku, okretanje dozvoljeno i nije jos okrenuta
    if (igra_u_toku == 1 && dozvoljen_potez == 1 && this.getAttribute('data-okrenuta') == 0) {

        // Postavlja se odgovarajuca slika kartice i indikator da je okrenuta
        this.setAttribute('src', 'images/' + imeFoldera + '/' + this.getAttribute('data-broj') + '.png');
        this.setAttribute('data-okrenuta', 1);

        // Ako jos nije izabrana prva kartica..
        if (prva_kartica == undefined) {
            prva_kartica = this; // Postavlja se vrednost na element koji je pozvao funkciju
            // - na karticu za koju je registrovan klik (this)
        } else // Ako prva kartica jeste izabrana, ali druga nije
        {
            druga_kartica = this;

            // Ako su kartice iste - vrednosti atributa data-broj su im jednake
            if (prva_kartica.getAttribute('data-broj') == druga_kartica.getAttribute('data-broj')) {
                // Azuriranje poena
                broj_poena += 10;
                poeni.innerHTML = broj_poena;

                // Deselektovanje kartica
                prva_kartica = undefined;
                druga_kartica = undefined;

                preostalo_polja -= 2;

                // Ako nema vise neotvorenih polja na tabli igra je zavrsena
                if (preostalo_polja == 0) {
                    igra_u_toku = 0;
                    nova_igra.disabled = false;
                    setTimeout(() => alert("POBEDA! \nSpojenih parova: " + broj_poena / 10 +
                        "\nza: " + (59 - preostalo_vreme) + " sekundi"), 300);
                }
            } else // U odabranom paru kartice nisu iste
            {
                dozvoljen_potez = 0; // Onesposobljava se klik na ostale kartice
                setTimeout(function() { // Postavlja se tajmer na 1s nakon cega se
                    // neuparene kartice ponovo okrecu

                    // Okretanje kartica na skrivene
                    prva_kartica.setAttribute('data-okrenuta', 0);
                    druga_kartica.setAttribute('data-okrenuta', 0);

                    // Postavljanje slike poledjine kartica
                    prva_kartica.setAttribute('src', 'images/back.png');
                    druga_kartica.setAttribute('src', 'images/back.png');

                    // Deselektovanje kartica
                    prva_kartica = undefined;
                    druga_kartica = undefined;
                    dozvoljen_potez = 1;

                }, 1000);
            }
        }
    }
}


// Inicijalizacija matrice sa rasporedom kartica
function inicijalizujMatricu() {
    // Definisanje niza
    matrica = [];
    // moze i sa:
    // matrica = new Array()

    for (i = 0; i < xMax; i++) {
        matrica[i] = []; // Za i-ti element niza navodimo da je i on novi niz (matrica je niz nizova)

        for (j = 0; j < yMax; j++) {
            matrica[i][j] = 0; // Inicijalizacija svih polja matrice na 0
        }
    }

    var i1, j1, i2, j2;

    // Smestanje kartica od 1 do 8 na po dva prazna polja na tabli
    for (var k = 1; k <= xMax * yMax / 2; k++) {
        do // Pronalazenje prvog slobodnog polja
        {
            // koordinata i
            i1 = Math.random(); // Generisanje slucajnog broja izmedju 0 i 1
            i1 = Math.trunc(i1 * 100) % xMax; // Dobijanje broja u intervalu [0, 3], trunc(...) odseca decimale

            // koordinata j
            j1 = Math.random();
            j1 = Math.trunc(j1 * 100) % yMax;

        } while (matrica[i1][j1] != 0) // Sve dok se ne pronadju koordinate polja koje je nije zauzeto

        matrica[i1][j1] = k; // Postavljanje kartice k na polje sa koordinatama (i1, j1)

        do // Pronalazenje drugog slobodnog polja
        {

            i2 = Math.random();
            i2 = Math.trunc(i2 * 100) % xMax;

            j2 = Math.random();
            j2 = Math.trunc(j2 * 100) % yMax;

        } while (matrica[i2][j2] != 0)

        matrica[i2][j2] = k;
    }
    console.log(matrica);
}


// Postavljanje bele senke iza kartice
function prikaziSenku() {
    this.style.boxShadow = '0px 0px 15px 3px white';
}

// Uklanjanje senke iza kartice
function skloniSenku() {
    this.style.boxShadow = 'none';
}


//Menjanje boje pozadine

var dugmeBoja = document.getElementById("dugmeBoja");

/* 
	Zatim dodeljujemo akciju prvom elementu.
*/
dugmeBoja.onclick = function() {
    /*
    	Pamtimo boje koje zelimo u nizu iz kog cemo 
    	nasumicno birati element.
    */
    var boje = ["AliceBlue", "Bisque", "GreenYellow", "LightSkyBlue", "RosyBrown ", "lLightGoldenRodYellow"];

    /*
    	Funkcija random iz klase Math daje nam 
    	slucajno odabran realan broj iz opsega 
    	[0, 1). Posto nama treba indeks niza, koji 
    	mora biti ceo broj, prvo cemo pomnoziti 
    	dobijenu vrednost sa broj elemenata u nizu, 
    	a onda zaokruziti rezultat. Time dobijamo 
    	cele brojeve iz opsega [0, boje.length-1].
    */
    var odabranaBoja = Math.floor(Math.random() * boje.length);
    document.body.style.backgroundColor = boje[odabranaBoja];
}