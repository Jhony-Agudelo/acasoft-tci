import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawData = `Alan Muriel Bedoya	1087563090	19/7/2019	5 años	Libertadores CRA 21#5a-22	La presentación 	Primero 	Marta Bedoya Osorio	Madre	3122202347
Alisson Gómez Tabares	1087563009	11/4/2019	6 años 	Man 6 casa c 18a10 la milagrosa 	La presentación 	Primero	Alexandra Tabares Granada	Madre	3215813316
Alma Sophia Correa Castaño 	1087563882	26/8/2021	3 años	CRA 10#8-34	Cipres	0	Keren castaño rojas 	Mamá 	3117492360
Amelia Berrío Fernandez	1087562595	7/4/2018	7 años	Cll 16a 8-53 el prado	Liceo Gabriela Mistral 	Segundo	Jessica Fernández Sánchez	Mamá 	3122004261
Ana Sofia Estrada Galvis	1087562661	7/6/2018	7 años 	CRA 11a #6-37 San Cayetano 	institución educativa nuestra señora de la presentación 	Primero 	Andrea Galvis Gómez	mamá 	3136056430
Ana Sofía Henao González 	1087563714	6/4/2021	4 años 	Cra 4 A # 10-19 Buenos Aires 	La Real academia 	Pre jardin 	Marcela González 	Madre 	3217998467
Anna Maríah Rodríguez Castaño 	1087560861	12/3/2016	9	CRA 10#8-34	Bernardo Arias Trujillo 	4.1	Keren castaño 	Mamá 	3117492360
Antonella Garzón Fernández	1086637048	11/6/2018	7 años	Calle 9 #10.105 la magdalena 	La presentación 	Primero 	Luz Omaira Fernández Suárez	Mamá 	3229718929
Antonella Rios Alcalde 	1087563950	21/10/2021	4	Calle 16ª #8-18 barrio los almendros 	Jardin cipres 	Prejardin 	Maria angelica alcalde 	Mamá 	3218360113
Celenne Segura Orrego	1087562159	14/8/2017	7  años	Calle 16 # 8c47 Santa Fe 	Nuestra señora de La presentación 	Segundo	Mayra Orrego	Mamá	3132445824
Celeste Antury	1089631385	22/2/2017	8 años	Calle 13 a # 6/60	Alfonso López 	Tercero	Alejandra	Mamá 	3223781960
Danilo Polo Cardona 	1138032440	31/1/2018	7 años 	Calle 16b#11a-36	Nuestra señora de la presentación 	Segundo 	María José Cardona Cardona 	Madre 	3127177916
Dereck Gabriel Rendón Dorado	1086636498	15/9/2014	10 años	Calle 18d n 9-58 tangarife 1 	Liceo Gabriela Mistral 	Quinto 	Natalia Dorado	Madre	3011189927
Dulce celeste Ramirez 	1087562952	1/3/2019	6 años	CRA 21 # 5-33	La presentación 	1	Carol Manuela Patiño 	Mama	3133707458
Dylan Stif Osorio Velez	1087562763	17/8/2018	6  años	Caimalito Azufral #133	La Salle	Primero 	Helem Julieth Maturana Velez	Hermana 	3148738713
Emiliano Echeverri Molina	1089632837	27/7/2017	7 años	Carrera 8a # 15 a 63 barrio almendros	La presentación 	Segundo	Nubia Molina	Madre	3106867021
Emily Herrera Londoño	1086636930	5/8/2017	7 años	Calle 7b#368 bbsanfernando	Nuestra señora de la presentacion	Segundo	Isabel Cristina Londoño	Mamá 	3196555868
Emma Jaramillo Mena	1084564061	4/1/2022	3 años	Calle 18B N9-27 tangarife 1 piso 2	La real academia 	Pre jardín 	Manuela Me a	Mamá 	3205861350
Hillary Duque González	1087562294	7/10/2017	7 años	CRA 8 # 9-50 barrio Restrepo 	La presentación 	Segundo	Yeny Viviana González	Madre	3022377886
Isac Duque Salazar	1089538258	11/4/2019	6 años	Espancion norte	La presentación 	Primero 	Jacqueline Salazar	Madre	3216151632
Jaris Cortes García	1086637071	15/8/2018	6 años 	Calle 16A #8-09 El prado 	La presentación 	Primero 	Luz Omaira Fernández Suárez	Tía paterna 	3229718929
Jeronimo Cano Mosquera	1019154875	30/5/2018	7 años	CALLE 18E 5A- 76	LA PRESENTACION	Primero 	Jennyfer Mosquera Vitola	MAMA	3145036574
Jhoan Alexander Londoño Lema	1087562632	12/5/2018	7  años	Calle 10a número 6-21	La presentación 	Primero 	Aracelly Lema	Madre	3012631733
Jhon Sebastián Cortés 	1086636523	27/10/2014	10 años	Calle 17 # 11-63 el Prado 	General Santander 	5C	Liliana Patricia Velásquez 	Mamá 	3154698583
Johan Thiago Caro Múnera	1087563204	9/11/2019	5 años 	Cra 8a #18b 28 bairon gaviria 	I.E nuestra señora de la presentación 	Transición 	Jessica Faisury Múnera Barco	Mamá 	3118474411
Joshua De La Hoz Gutiérrez	1215969003	8/9/2018	6 años 	Clle 15 # 6a-17 los almendros 	La presentación 	Primero	Diana Isabel Gutiérrez	Mamá 	3041295257
Juan Esteban Correa Gil	1184463146	15/7/2015	9 años 	Barrio 7 enero calle 18 #11a56 la Virginia 	Alfonso López pumarejo	3-B	Keren  elisa castaño rojas 	Tia	3117492360
Juan José Parra Montoya 	1087562247	13/9/2017	7 años 	Calle 15 # 7a 40 barrio obrero 	La presentación 	Segundo 	Yaritza Alejandra Montoya Taborda 	Mamá 	3103229568
Juan Miguel Berrio Ramirez	1089626548	5/9/2015	9 años	Carrera 8a # 15a-67 	Monterrosales homeschool 	4	Diana Ramirez 	Mamá 	3114101776
Justin Betancourt Montoya 	1087562825	18/10/2018	6	Carrera 6 # 5 32	Nuestra señora de la presentación 	1a	Suli Montoya Gil 	Mamá 	3122021368
Luciana Posada Zuleta	1087563505	13/10/2020	4 años	CRA 8b #18b 45 tangarife 1	Institución Educativa General Santander 	Preescolar 	Karen Zuleta -Mercedes Suárez 	Madre - Abuela 	3116175828
María Celeste Carmona Henao	1087563255	8/1/2020	5 años 	Transversal 7 número 7 101 barrio centro 	Nuestra señora de la presentación 	Transición 	Jhesenia Henao Blandón	Mamá 	3132881912
Maria Jose Holguín Contreras 	1087562460	26/12/2017	7 años 	Carrera 11 15 A 23 santa fe 	Liceo Gabriela Mistral 	Segundo 	Pamela Contreras ortiz	Mamá 	3217541156
María Salomé Restrepo Acosta	1087562992	1/4/2019	6 años 	Cra11 #18e18	Nuestra señora de la presentación 	Primero 	Lina Acosta	Mamá 	3127285910
Mariana Arroyave villa 	1087556687	10/1/2012	13	Crr221e 03 Pedro Pablo bello 	Alfonzo López 	6b	Diana Marcela villa 	Mama	3127938500
Martín Hincapié Cañizales	1089638020	14/3/2019	6 años	Cra 10 18 b 61 	Nuestra señora de la presentación 	Primero 	Daniela Cañizales	Mamá 	3228052848
Martín Salas Arenas 	1091279069	4/2/2018	7 años	"Barrio Santa Fe -Calle 15 a # 8c -16
Segundo piso"	Alfonso López 	SegundoB	María Camila arenas 	Mamá 	3227150968
Mateo Henao Quintero	1087562879	12/12/2018	6 años	Calle 16a número 6a-66 	La presentación 	Primero 	Ana María Quintero Molina	Mamá 	3117377267
Matías Castaño Vera	1087562401	23/11/2017	7  años	Caimalito centro casa 374A	Escuela Ricaute	Segundo	Diana Zulay Vera Marin	Madre	3145755953
Matías Gil Campiño	1086637042	15/6/2018	7  años	Cll16 #5c-45	Nuestra señora de la presentación 	Primero 	Maria Alejandra Campiño Gómez	Madre	3128110005
Matías Hernández									
Mauricio Gómez Restrepo 	1087563929	3/10/2021	3	Calle 13 n 4-39 los gavilanes	Real academia 	Pre jardin	Viviana Restrepo 	Madre	3113317241
Maximiliano Vallecilla Londoño	1087562905	16/1/2019	6  años	Calle 14 # 2-73 el progreso 	Nuestra señora de la presentación 	Primero 	Jessica Londoño	Madre	3104905062
Miguel Ángel Escobar Quintero 	1087564068	10/1/2022	3 años	Calle 16a 8-59 El Prado 	Programa de cero a siempre	0	Devy Quintero	Madre	3117894115
Miguel Ángel Patiño Muñoz	1086637004	22/2/2018	7 años	Caimalito centro casa 246	Institución educativa Antonio Ricaurte 	Segundo	Gloria Isabel Velez	Abuela 	3218500287 - 3127761662
Nahiara Gómez Londoño	1087562886	21/12/2018	6 años	Calle 8 n. 4-58 el Edén 	Institución Educativa nuestra Señora de La Presentación	Primero	Leidy Ana Londoño G	Mama	3213256275
Nicolás Mejia Restrepo	1086636918	2/7/2017	7 años 	Calle 15 # 11-38	Colegio nuestra señora de la presentación 	Segundo 	Yamileth Restrepo	Madre 	3178812254
Paulina Machado Vente	1087562744	17/8/2018	6 años	Calle 16#11-17	Alfonzo López pumarejo	Primero	Laura Dahiana Vente Cañizales	Mama	3148876885
Samantha Betancourt Montoya 	1086636919	26/6/2017	8	Carrera 6 #5 32	Nuestra señora de la presentación 	2c	Suli Montoya Gil 	Mamá 	3122021368
Samantha Martínez Herrera	1086637063	24/7/0018	7 años	Cr9 n 8 38 la magdalena 	Liceo la salle 	Primero 	Yeny Marcela Herrera	Mamá 	3125693824
Samuel Henao Arango 	1037675757	18/12/2021	3	Calle 17 8 c 12 barrio el prado primer piso	Guardería principal 	Pre Jardín 	Nataly Arango Acevedo 	Madre 	3145676764
Santiago Duque González	1089638646	27/5/2019	6 años 	CRA 8 # 9-50 barrio Restrepo 	La presentación 	Primero 	Yeny Viviana González	Madre	3022377886
Sara Montoya Sánchez 	1087563024	1/5/2019	6 años	CR 8 b #18b76 barrio/baiton gaviria	Nuestra señora de la presentación 	Primero 	Kelly Sánchez 	Mamá 	3132552779
Sophia Medina Chavarriaga	1087562783	5/9/2018	6 años	Cra 10# 8-43	La presentacion	Primero 	Diana Alexandra Chavarriaga Alzate	Mama	3118117256
Thiago Diaz Vicuña 	1113871430	23/11/2021	3 años	Carrera 8C 15 15 	CDI la Virginia-guardería principal 	Pre-jardín 	Yesenia vicuña Sánchez 	Madre 	3155861443
Valerie Rivera Gil 	1087561829	23/3/2017	8 años 	Calle 16 n 8c 27 barrio Santa Fe 	Liceo Gabriela Mistral 	3-d	Diana Alejandra Gil cano 	Madre 	3209992737
Valery Osorio Jaramillo	1087562818	21/10/2018	6 años	Calle 18b #975 tangarife 1			Carolina Jaramillo	Mama	3043503032
Victoria Molina Peña	1087563799	26/6/2021	4	Calle 16 # 4 b 51 	Cdi la Virginia	Jardín 1	Mónica Paola Peña 	Madre	3223062196`;

function convertirGrado(grado: string): string {
  if (!grado) return 'N/A';
  
  const mapping: Record<string, string> = {
    '0': 'Transición',
    '1': 'Primero',
    '1a': 'Primero',
    '2': 'Segundo',
    '2c': 'Segundo',
    '3': 'Tercero',
    '3-b': 'Tercero',
    '3-d': 'Tercero',
    '4': 'Cuarto',
    '4.1': 'Cuarto',
    '5': 'Quinto',
    '5c': 'Quinto',
    '6': 'Sexto',
    '6b': 'Sexto',
  };
  
  const normalizado = grado.trim().toLowerCase();
  
  // Buscar coincidencia exacta
  if (mapping[normalizado]) return mapping[normalizado];
  
  // Si contiene el número pero tiene letras extra, extraemos el número principal
  if (normalizado.includes('1')) return 'Primero';
  if (normalizado.includes('2')) return 'Segundo';
  if (normalizado.includes('3')) return 'Tercero';
  if (normalizado.includes('4')) return 'Cuarto';
  if (normalizado.includes('5')) return 'Quinto';
  if (normalizado.includes('6')) return 'Sexto';
  if (normalizado.includes('0')) return 'Transición';

  // Si no mapea a nada específico numérico, devuelve el original con mayúscula inicial
  return grado.charAt(0).toUpperCase() + grado.slice(1);
}

async function main() {
  const lines = rawData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (const line of lines) {
    const parts = line.split('\t');
    if (parts.length < 10) {
      if (parts.length >= 8) {
        // Rellenar columnas vacías si faltan al final
        while (parts.length < 10) parts.push('');
      } else {
        console.log("Saltando línea incompleta o vacía:", line);
        continue;
      }
    }

    const [
      nombre_estudiante,
      documento,
      fecha_nacimiento,
      edad_str,
      direccion,
      colegio,
      grado_original,
      nombre_acudiente,
      parentesco,
      telefono
    ] = parts.map(p => p.trim().replace(/^"|"$/g, '')); // remove quotes if any

    if (!documento) continue;

    // Solo conservar número en Edad
    let edad = parseInt(edad_str.replace(/\D/g, ''), 10);
    if (isNaN(edad)) edad = 0;

    // Convertir grado a texto
    let grado = convertirGrado(grado_original);

    // 1. Guardián
    let guardian = await prisma.guardians.findFirst({
      where: { telefono: telefono || 'Sin Teléfono' }
    });

    if (!guardian) {
      guardian = await prisma.guardians.create({
        data: {
          id: `grd_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          nombre_completo: nombre_acudiente || 'Sin Nombre',
          direccion: direccion || 'Sin Dirección',
          telefono: telefono || 'Sin Teléfono',
          parentesco: parentesco || 'Acudiente'
        }
      });
    }

    // Split student name
    const nameParts = nombre_estudiante.split(' ');
    let nombres = nombre_estudiante;
    let apellidos = '';
    
    if (nameParts.length >= 3) {
      apellidos = nameParts.slice(-2).join(' ');
      nombres = nameParts.slice(0, -2).join(' ');
    } else if (nameParts.length === 2) {
      nombres = nameParts[0];
      apellidos = nameParts[1];
    }

    // 2. Estudiante
    const studentExists = await prisma.students.findUnique({
      where: { documento_identidad: documento }
    });

    if (!studentExists) {
      await prisma.students.create({
        data: {
          id: `std_${documento}`,
          documento_identidad: documento,
          nombres,
          apellidos,
          fecha_nacimiento,
          edad,
          colegio_origen: colegio || 'N/A',
          grado_escolar: grado,
          curso_actual: 'N/A',
          jornada_escolar: 'Mañana',
          guardian_id: guardian.id,
          status: 'ACTIVE',
          payment_deadline_date: new Date().toISOString(),
          payment_day: 15,
        }
      });
      console.log(`✅ Importado: ${nombres} ${apellidos} (Grado: ${grado}, Edad: ${edad})`);
    } else {
      console.log(`⚠️ Ya existe: ${documento} (${nombres} ${apellidos})`);
    }
  }

  console.log("¡Importación de estudiantes finalizada!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
