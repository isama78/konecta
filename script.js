let tecnicosToa = []
let tecnicosData = []
let todosLosTecnicos = []

const inputCrudo = document.querySelector('#file_upload')
const botonCrudo = document.querySelector('#btn-file-upload')
const select = document.querySelector('select')
const boton = document.querySelector('#btn-toa')

const botonPre = document.querySelector('#pre')

const lista = document.querySelector('.se-quedan')
const lista2 = document.querySelector('.se-van')
const lista3 = document.querySelector('.francos')
const lista4 = document.querySelector('.datos-tecnicos')

const check1 = document.querySelector('#check-1')
const check2 = document.querySelector('#check-2')
const check3 = document.querySelector('#check-3')

const trash1 = document.querySelector('#trash-1')

const trash2 = document.querySelector('#trash-2')
const trash3 = document.querySelector('#trash-3')

const copyListener = document.querySelector('.listas')


//FUNCION PARA CARGAR LISTA DEL SELECT DE BKTS
const cargarBkts = (listaTecnicos) => {
    return todosLosTecnicos.forEach(tecnico => {
        if (!select.innerHTML.includes(tecnico.bkt)) {
            select.innerHTML += `<option>${tecnico.bkt}</option>`
        }

    })
}

//LIMPIA EL CAMPO INPUT DEL CRUDO
trash1.addEventListener('click', () => {
    inputCrudo.value = ''
    select.innerHTML = ''
})

//LIMPIA EL CAMPO DE TECNICOS TOA
trash2.addEventListener('click', () => document.querySelector('#toa').value = '')

//LIMPIA LAS COLUMNAS DEL PRE
trash3.addEventListener('click', () => {
    lista.innerHTML = ''
    lista2.innerHTML = ''
    lista3.innerHTML = ''
    lista4.innerHTML = ''
})

botonCrudo.addEventListener('click', (e) => {
    e.preventDefault()
    var files = document.getElementById('file_upload').files;
    if (files.length == 0) {
        alert("Seleccione algún archivo .xlsx...");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        excelFileToJSON(files[0]);
    } else {
        alert("Seleccione un archivo con extensión .xlsx");
    }
})

//Method to read excel file and convert it into JSON 
function excelFileToJSON(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    roa.forEach(tecnico => {
                        if (!select.innerHTML.includes(tecnico.bkt)) {
                            select.innerHTML += `<option>${tecnico.bkt}</option>`
                        }
                    })
                    todosLosTecnicos = [roa];

                }
            });

        }
    } catch (e) {
        console.error(e);
    }
}



//ESCUCHA EL ITEM "SELECT", TOMA EL VALOR SELECCIONADO Y GENERA LA LISTA DE TECNICOS PARA HACER EL PRE
select.addEventListener('change', () => {
    const bktSeleccionado = select.options[select.selectedIndex].text
    const listaTecnicosData = todosLosTecnicos[0].filter(tecnico => tecnico.bkt === bktSeleccionado)
    tecnicosData = [...listaTecnicosData]
})


boton.addEventListener('click', (e) => {
    if (select.options[select.selectedIndex].text === '') {
        alert('Debe seleccionar el backet a realizar antes de cargar los técnicos de TOA')
        document.querySelector('#toa').value = ''
    } else {
        e.preventDefault()
        let datosInput = document.querySelector('#toa').value.trim()
        const arrayTecnicos = datosInput.split('  ')
        // const arrayObjetosTecnicos = todosLosTecnicos[0].filter(objTecnico => arrayTecnicos.includes(objTecnico.nombre))
        //NO PUEDE FALTAR NINGUNO DE LOS TECNICOS DE TOA  EN LA LISTA SIGUIENTE. TECNICOS TOA DEBE SER SOLO UN ARRAY DE NOMBRES
        tecnicosToa = [...arrayTecnicos]
    }


})

//LÓGICA DE COMPARACION DE LISTAS PARA HACER EL PRE
botonPre.addEventListener('click', () => {
    if (tecnicosToa.length === 0) {
        alert('Debe cargar los técnicos de TOA antes de realizar el pre routing')

    } else {
        //LLENA LA LISTA DE TECNICOS PARA TRAER
        if (lista.innerHTML === '' && lista2.innerHTML === '' && lista3.innerHTML === '') {
            tecnicosData.forEach(tecnicoData => {
                if (!tecnicosToa.includes(tecnicoData.nombre)) {
                    lista.innerHTML += `<li class="mx-1 item-lista-1 px-1 list-group-item py-0 list-group-item-success list-group-item-numbered">${tecnicoData.nombre}<i class="bi bi-front text-dark copy"></i></li>`
                    lista4.innerHTML += `<li class="mx-1 list-group-item py-0 px-1 list-group-item-success"><span class="fw-bold">${tecnicoData.cupo_programado}</span> |  ${tecnicoData.empresa.substring(0, 10)}</li>`
                }
            })

            tecnicosToa.forEach(tecnicoToa => {
                const tecnicoTraido = todosLosTecnicos[0].find(tech => tech.nombre === tecnicoToa)
                if (!tecnicosData.some(tecnicoData => tecnicoData.nombre === tecnicoToa)) {
                    if (todosLosTecnicos[0].some(tecnicoCrudo => tecnicoCrudo.nombre === tecnicoToa)) {
                        lista2.innerHTML += `<li class="mx-1 list-group-item px-1 py-0 list-group-item-success list-group-item-numbered">${tecnicoTraido.nombre} | <span class="fw-bold">${tecnicoTraido.bkt.substring(0, 17)}</span></li>`
                    } else {
                        lista3.innerHTML += `<li class="mx-1 item-lista-1 list-group-item px-1 py-0 list-group-item-success list-group-item-numbered">${tecnicoToa}<i class="bi bi-front text-dark copy"></i></li>`
                    }
                }
            })
        }

    }
})

copyListener.addEventListener('click', (e) => {
    if (e.target.className.includes('copy')) {
        let texto = e.target.parentElement
        const tempInput = document.createElement('input')
        tempInput.setAttribute('value', texto.innerText)
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
    }
})