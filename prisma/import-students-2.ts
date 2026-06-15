import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const rawData = `Alan Muriel Bedoya	1087563090	19/7/2019	6	Libertadores CRA 21 #5a-22	Nuestra Señora de la Presentacion	2	Marta Bedoya	1088536540	Madre	3122202347
Allison Gonzalez Castaño 	1087563828	13/7/2021	4 años 	Carrera 7 #8-37 centro	Hogar ternura 	Transicion 	Patricia Castaño Diaz	CC 42029705	Madre	3223762691
Allyn Yarianna Benjumea Pulgarin 	1086636866	20/1/2017	9 años	Caimalito azufral casa 141	Gabriel trujillo	4	Yuliana andrea pulgarin toro0	1087552993	Madre	3122111416
Ana Sofía Henao González 	1087563714	6/4/2021	4	Cra 4 A # 10-19 Buenos Aires 	La presentación 	Transición 	Leidy Marcela González Castañeda 	1088252026	Madre	3217998467
Antonela Vanegas Giraldo	1086637051	21/6/2018	7	Calle 15 # 7a 19	La presentación 	3	Viviana Giraldo 	1112764463	Madre 	3127630514
Aythana Osorio villada 	1086636974	26/12/2017	8 años	Caimalito zona franca casa 056	La presentación 	3	Paola villada 	1087553480	Madre	3209315603
Celenne Segura Orrego	1087562159	14/8/2017	8	Calle 16 # 8 c 47 Santa Fe 	Nuestra señora de la presentación 	3	Mayra Alejandra orrego	1087559293	Mamá 	3132445824
Celeste Gómez Álvarez	1087562633	5/5/2018	7	CRA 8c 13-72  piso 2 barrio Balsillas 	La presentación 	3	Diana Milena Alvarez	42030665	Mamá 	3136242795 -3234409699
Danilo Polo Cardona 	1138032440	31/1/2018	7 añoa	Calle 16b#11a-36 pio xll	Nuestra señora de la presentación 	Segundo 	María José Cardona 	1010117375	Madre	3127177916
Dulce Maria Villa Gomez	1087563218	24/11/2019	6	Kra 6a  # 9-15 B/ Restrepo 	Nuestra Señora De La Presentacion	Primero	Maria cecilia Gomez Sanchez	42021382	Abuela Materna	3144005029
Dylan Stif Osorio Velez 	1087562763	2/8/2018	7 años 	Caimalito Azufral #133	Liceo Gabriela Mistral 	2	Hellem Maturana 	1006439126	Hermana 	3148738713
Emiliana Hincapie Durango	1087562224	9/9/2017	8 años	Calle16 a #5c52 barrio cipres	Nuestra señora la presentacion	3 grado	Luz dary durango ramos	42022474	Abuela	3205087161
Emiliano Echeverri Molina 	1089632837	27/7/2017	8 años 	Carrera 8a # 15 a 63	La presentación 	Tercero 	Nubia Molina 	31306468	Madre 	3106867021
Emiliano Valderrama Cano	1128908202	19/5/2014	11 años y 9 meces 	Carrera 6 N 15 A 24 los almendros 	La presentacion	7B	Marta lucia gonzalez carrillo 	42025569	Abuela	3162110790
Emily Herrera Londoño	1086636930	5/8/2017	8 años	Calle8 #311	Nuetra señora de la presentacion	Tercero	Isabel cristina londoño	42030918	Madre	3196555868
Gael Taborda Vélez 	1087564478	6/1/2023	3 años	Carrera 8a #18 b 36 barrio Byron Gaviria 	Carrusel de niños	No aplica	Diana Carolina Vélez Arango 	1087560272	Madre	3207742364
Hillary Duque  González 	1087562294	7/10/2017	8	Transversal 6 # 8-24	La presentación 	3	Yeny Viviana González 	1087550147	Mamá 	3022377886
Iam Santiago Lopez Rodriguez 	1104551509	7/4/2015	10	Carrera 5a #9-37	Nuestra señora la presentacion 	6	Lorena rodriguez 	1005720181	Mama	3008389244
Isaac Montoya Restrepo 	1089622330	23/1/2014	12	Callle 15 a nro 8 C 13 / Santa Fe 	Alfonso López pumarejo 	7	Jessica Marcela Montoya Restrepo 	1087556468	Madre	3103552196
Isac Duque Salazar 	1089638258	11/4/2019	6	Calle 19 11-16 	La presentación 	2	Jacqueline Salazar 	1087554733	Madre	3216151632
Ismael García Usma	1087563820	8/7/2021	4 años y medio	Calle 12 # 5A-19 	COLEGIO NUESTRA SEÑORA DE LA PRESENTACIÓN 	TRANSICIÓN 	NORMA JULIETH USMA ZAPATA 	1087548393	MAMÁ 	3208096406
Ivana Ríos Sánchez 	1087564297	3/8/2022	3 años 	Caimalito centro casa 44	Los piolines	No aplica 	Yuliana Sanchez lizarazo	1087558559	Madre	3002758272
Jhoan Alexander Londoño Lema 	1087552913	12/5/2018	7	Calle 10a 6-21 Restrepo 	La presentación 	2A	Aracelly lema 	1087552913	Masre	3012631733
Jhon Sebastián Cortés Velásquez 	1086636523	27/10/2014	11	Calle 17 # 11-63 Barrio el prado 	La presentación 	6	Liliana Patricia Velásquez Ruiz 	38467409	Mamá 	3154698583
Johan Thiago Caro Múnera 	1087563204	9/11/2019	6	Cra 8a #18b 28 bairon gaviria segundo piso 	Nuestra señora de la presentación 	Primero	Jessica Faisury Múnera Barco 	1087560678	Mamá 	3118474411
Joshua de la Hoz Gutiérrez 	1215969003	8/9/2018	7	Cra 6 #18b-52 bayron Gaviria 	La presentación 	2	Diana Isabel	1117510999	Mamá 	3041295257
Juan José Parra Montoya 	1087562247	13/9/2017	8 años	Calle 15 # 7a 40 barrio obrero 	La presentación 	3	Yaritza Alejandra Montoya 	1087559923	Mama	3103229568
Juan Pablo Marín Zapata	1087563671	4/3/2021	4	Calle 16 # 11 b 34 	Nuestra señora de la presentacion	0	Dahiana zapata	1087559659	Mamá	3154858511
Juan Sebastián  Arredondo Ríos 	1087563383	14/7/2020	5	Caimalito casa 124	La presentación 	0	Mary luz rios tangarife 	42030624	Mamá 	3122381873
Juana Sofía Hincapié Llóreda	1087563050	28/5/2019	6	Expansión 	La presentación 	1	Angie lloreda	1004627318	Mama	3215365543
Luciana Arroyave Marín 	1087564166	10/4/2022	3 años 	Calle 16 a #  9 a 69 el prado	Real académia	Pre- jardin	Derly Janeth Marin Giraldo 	42032430	Mamá	3103845332
Luciana Mejia Aguirre 	1087561066	7/5/2016	9 años	Calle 7b# 3-38 	La presentación 	4 b	Carolina Aguirre 	1088250308	Mama	3216777756
Luciana Posada Zuleta	1087563505	13/10/2020	5 años	CRA 8b #18b 45 tangarife 1	General Santander 	1°	Karen Zuleta	1004627655	Madre	3116175828
Luciana Rua 	1087563583	18/12/2020	5	Cra 4 A # 10-22 Buenos Aires 	La presentación 	Trancision 	Yaneth Rua 	42031563	Madre	3127926799
Maria Paula Benjumea Rodriguez 	1089638628	29/4/2019	6	Carrera 5a #9-37	Liceo gabriel mistral	2	Lorena rodriguez 	1005720181	Mama	3008389244
María Salomé Restrepo Acosta 	1087562992	1/4/2019	6 años 	Cra 11 # 18 e 18 tangarife 2 	Nuestra señora de la presentación 	Segundo 	Lina acosta 	1087560362	Mamá 	3127285910
Martín Gutiérrez Florez	1087559226	9/7/2014	11 años 	Calle 12 #5a 32	La presentación 	1 de bachiller	Monica florez 	24551920	Mamá 	311 6247764 
Martin Hincapié Cañizales	1089638020	14/3/2019	6 años 	Cra 10 18 b 61 	La presentación 	Segundo 	Daniela canizales	1087558004	Madre	3228052848
Mateo Henao Quintero 	1087562879	12/12/2018	7 años 	Calle16a número 6a-66 	La presentación 	2	Ana María Quintero molina 	1041146790	Mamá 	3117377267
Mateo Pérez Montaño	1234790221	25/7/2016	9	Calle 16 # 11 b 34 Pío doce 	Alfonso López pumarejo	4	Dahiana zapata	1087559659	Tia	3154858511
Matías Castaño Vera Marin	1087562401	23/11/2017	8	Caimalito centro casa 374a	Escuela Ricaute	3	Diana Vera	42029352	Madre	3145755953
Matías Gil campiño	1086637042	15/6/2018	7	Cll16 # 5c-44 ciprés 	Presentación 	2	María Alejandra campiño Gómez 	1087557112	Madre	3128110005
Matías Hernández Valencia	1087563010	8/4/2019	6	Calle 8 a #7-26	La Presentación 	2	Huberney Hernández 	9764125	Papá 	3174174912
Matías Vásquez Carrion	1086636765	31/3/2016	9	Calle 16a # 8-67	Nuestra señora la presentacion	5	Mayerli Carrión rios 	1087560594	Madre 	3005652657
Mauricio Gómez Restrepo 	1087563929	3/10/2021	4 años	Calle 16 a n 8-41 el prado 	Translinguakids	No aplica 	Viviana Restrepo 	1087557388	Madre	3113317241
Maximiliano Vallecilla Londoño	1087562905	16/1/2019	6	Calle 14 # 2-73 el progreso 	La presentación 	2	Jessica Londoño 	1087554361	Madre	3104905062
Miguel Angel Escobar Quintero 	1087564068	10/1/2022	4 años	Calle 16A 8-59 Barrio El Prado 	La Real Academia	Jardin 	Devy Dyana Quintero Ospina 	1087548516	Mamá 	3117894115
Miguel Ángel Patiño Muñoz 	1086637004	22/2/2018	7 años	Caimalito centro casa 246	Antonio Ricaurte 	Segundo 	Dahianna Muñoz 	1087561474	Mamá 	3218500287
Nahiara Gómez Londoño	1087562886	21/12/2018	7 años	Calle 8 n. 4-58 el Eden	Nuestra señora de La Presentación 	Segundo	Leidy Ana Londoño Giraldo	42031058	Madre	3213256275
Nicolás Mejia Restrepo 	1086636918	2/7/2017	8	Calle 15 # 11-38 B/. Sigifredo Zuleta 	Colegio nuestra señora de la presentación 	3	Yamileth Restrepo López 	1087551609	Madre 	3178812254
Nikolas Marín Rojas	1086636683	6/11/2015	10	Carrera 6a#18b49	Nuestra Señora la presentación	Quinto	Nancy Osorio	42024 137	Abuela	321 834 99 00
Paulina Machado Vente 	1087562744	17/8/2018	7 años	Calle16# 11-17	Alfonzo López pumarejo 	Segundo	Laura vente	1087561082	Mama	3148876885
Samantha Gil Cubillos	1087563153	4/1/2019	6	Cll 5#6-27	La presentación 	Primero 	Jennifer Tatiana cubillos 	1087560742	Madre	3003847542
Samir Velásquez Rojas 	1087561099	21/6/2016	9 año	Calle 18e 9-74 tangarife	Nuestra señora de la presentación 	4	Mercedes Pérez Ramírez 	24511153	Abuela	3148119159
Samuel Henao Arango	1037676757	18/12/2021	4	Calle 17 N 8c12	Cdi la virginia	Jardin	Andrés Henao 	1036646968	Padre	3234031004
Samuel Marulanda Galeano 	1086636800	20/7/2016	9	Calle 9 3-86 barrio la playa 	La presentacion	Cuarto (4)	Maryury Galeano Gonzalez 	42029223	Mama	3206687624
Santiago Duque González 	1089638646	27/5/2019	6	Transversal 6 # 8-24	La presentación 	2	Yeny Viviana González 	1087550147	Mamá 	3022377886
Sara Montoya Sánchez 	1087563024	1/5/2019	6	Calle 12 a 6-56 balsillas 	Nuestra señora de la presentación 	2	Kelly Johana Sánchez muñoz 	1087556123	Mamá 	3132552779
Sariana Muñoz Correa	1086636461	9/7/2009	11 años	Azufral casa 8 28	La presentación 	7	Alejandra Correa	1118298634	Madre	3172950453
Sophia Medina Chavarriaga	1087562783	5/9/2018	7	Cra 10# 8- 43 barrio la magdalena	Colegio la presentacion	2	Diana alexandra chavarriaga alzate	1087552340	Madre	3118117256
Thiago Diaz vicuña 	1113871430	23/11/2021	4	Carrera 8C 15-15 	CDI la Virginia 	N/A	Yesenia vicuña Sánchez 	1112785235	Madre 	3155861443
Valery Osorio Jaramillo 	1087562818	21/10/2019	7	Calle 18b #9-75	La presentación 	2	Carolina jaramillo 	1087548757	Mama	3043503032
Victoria Molina Peña	1087563799	26/6/2021	4	Calle 16 # 4 b 51 	Nuestra señora la presentación 	0	Mónica Paola Peña 	1087557964	Madre 	3223062196
Yhojan Steban Zapata Carvajal	1086637297	12/5/2020	5	Cr 8b N 18b69 bairon gaviria 	La presentacion	1 primero 	Diana Marcela Carvajal gonzales 	1088331582	Mama 	3128581050
Yurly Salomé Urriago Veloza 	1184463212	13/2/2017	9	Caimalito barrio azufral casa 875	Gabriel Trujillo 	4	Blanca rubí veloza garzón 	1053339341	Madre 	3214636875`;


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

function convertirColegio(colegio: string): string {
  if (!colegio) return 'Otro / Particular';
  
  const normalizado = colegio.trim().toLowerCase();
  
  if (normalizado.includes('presentación') || normalizado.includes('presentacion')) return 'Colegio Nuestra Señora de la Presentación';
  if (normalizado.includes('gabriela') || normalizado.includes('mistral')) return 'Institución Educativa Liceo Gabriela Mistral';
  if (normalizado.includes('alfonso') || normalizado.includes('lópez') || normalizado.includes('lopez')) return 'Institución Educativa Alfonso López Pumarejo';
  if (normalizado.includes('bernardo') || normalizado.includes('arias')) return 'Institución Educativa Bernardo Arias Trujillo';
  if (normalizado.includes('real academia')) return 'Colegio La Real Academia';
  if (normalizado.includes('pedro pablo')) return 'Institución Educativa Pedro Pablo Bello';
  if (normalizado.includes('liceo integrado')) return 'Liceo Integrado de La Virginia';
  if (normalizado.includes('bienestar rural')) return 'Centro Educativo Bachillerato en Bienestar Rural';
  if (normalizado.includes('hogar infantil') || normalizado.includes('icbf')) return 'Hogar Infantil Comunitario La Virginia (ICBF)';
  if (normalizado.includes('renacer')) return 'Jardines del Renacer';
  if (normalizado.includes('feducar')) return 'Preescolar Instituto Feducar';
  
  return 'Otro / Particular';
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
          colegio_origen: convertirColegio(colegio),
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
