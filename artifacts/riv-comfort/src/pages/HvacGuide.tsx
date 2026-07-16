import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'wouter';

const BASE = import.meta.env.BASE_URL;

const AVAIL_STATES = new Set([
  'Alabama','Arizona','Arkansas','California','Colorado','Delaware','Florida',
  'Georgia','Illinois','Indiana','Kansas','Kentucky','Minnesota','Mississippi',
  'Missouri','Montana','Nevada','New Jersey','New Mexico','New York',
  'North Carolina','Ohio','Pennsylvania','South Carolina','Tennessee','Texas',
  'Utah','Virginia','West Virginia','Wisconsin',
]);

const ACCENT = '#a3ddc1';

// ── Translations ────────────────────────────────────────────────────────────
type Lang = 'en' | 'es';

const T = {
  en: {
    fieldGuide: 'FIELD GUIDE',
    installLabel: 'HVAC INSTALLATION',
    serviceAvailable: 'SERVICE AVAILABLE',
    notAvailable: 'NOT AVAILABLE',
    statesCount: '30 States',
    fieldResources: 'Field Resources',
    documents: 'DOCUMENTS',
    download: 'DOWNLOAD',
    comingSoon: 'COMING SOON',
    courseTitle: 'Selling HVAC for Dummies',
    downloadFullPdf: 'DOWNLOAD FULL PDF',
    siteVisitTitle: 'How to perform a site visit',
    repPortal: 'REP PORTAL',
  },
  es: {
    fieldGuide: 'GUÍA DE CAMPO',
    installLabel: 'INSTALACIÓN DE HVAC',
    serviceAvailable: 'SERVICIO DISPONIBLE',
    notAvailable: 'NO DISPONIBLE',
    statesCount: '30 Estados',
    fieldResources: 'Recursos de Campo',
    documents: 'DOCUMENTOS',
    download: 'DESCARGAR',
    comingSoon: 'PRÓXIMAMENTE',
    courseTitle: 'Vender HVAC para Principiantes',
    downloadFullPdf: 'DESCARGAR PDF COMPLETO',
    siteVisitTitle: 'Cómo realizar una visita al sitio',
    repPortal: 'REP PORTAL',
  },
};

// ── Resource data ────────────────────────────────────────────────────────────
function getResources(lang: Lang) {
  if (lang === 'es') return [
    { tag: 'PDF', kind: 'DOCUMENTO', title: 'Visuales de Venta', desc: 'Presentación para el cliente durante la visita a domicilio', file: 'assets/riv_comfort_comfort_solutions.pdf' },
    { tag: 'PDF', kind: 'DOCUMENTO', title: 'Pitch del Setter', desc: 'El discurso que convierte', file: 'assets/riv_comfort_setter_pitch.pdf' },
    { tag: 'PDF', kind: 'DOCUMENTO', title: 'Guion del Closer', desc: 'Flujo interno para maximizar tus cierres', file: 'assets/riv_comfort_closer_script.pdf' },
    { tag: 'PDF', kind: 'DOCUMENTO', title: 'Financiamiento Palmetto', desc: 'Palmetto Lease 101', file: 'assets/palmetto_comfort_plan.pdf' },
    { tag: 'HERRAMIENTA', kind: 'EXTERNO', title: 'Calculadora del Plan de Confort', desc: 'Calculadora de pagos', url: 'https://palmetto-comfort-plan-calculator.lovable.app/', cta: 'ABRIR' },
    { tag: 'VIDEO', kind: 'EXTERNO', title: 'Cómo hacer una propuesta', desc: 'Mira el tutorial para armar una propuesta', url: 'https://www.loom.com/share/af62b976dadb493998d2a8483fa92988', cta: 'VER VIDEO' },
  ];
  return [
    { tag: 'PDF', kind: 'DOCUMENT', title: 'Sales Visuals', desc: 'Customer-facing presentation deck for the in-home sit', file: 'assets/riv_comfort_comfort_solutions.pdf' },
    { tag: 'PDF', kind: 'DOCUMENT', title: 'Setter Pitch', desc: 'The Pitch that converts', file: 'assets/riv_comfort_setter_pitch.pdf' },
    { tag: 'PDF', kind: 'DOCUMENT', title: 'Closer Script', desc: 'In house flow to maximise your closes', file: 'assets/riv_comfort_closer_script.pdf' },
    { tag: 'PDF', kind: 'DOCUMENT', title: 'Palmetto Financing', desc: 'Palmetto Lease 101', file: 'assets/palmetto_comfort_plan.pdf' },
    { tag: 'TOOL', kind: 'EXTERNAL', title: 'Comfort Plan Calculator', desc: 'Payment Calculator', url: 'https://palmetto-comfort-plan-calculator.lovable.app/', cta: 'OPEN' },
    { tag: 'VIDEO', kind: 'EXTERNAL', title: 'Making a proposal', desc: 'Watch the walkthrough on building a proposal', url: 'https://www.loom.com/share/af62b976dadb493998d2a8483fa92988', cta: 'WATCH VIDEO' },
  ];
}

// ── Course data ───────────────────────────────────────────────────────────────
type Block =
  | { kind: 'sub'; title: string }
  | { kind: 'text'; text: string }
  | { kind: 'list'; title: string | null; items: string[] }
  | { kind: 'script'; title: string; text: string }
  | { kind: 'callout'; title: string; items: string[] };

interface Chapter { num: string; title: string; blocks: Block[] }

function buildCourse(lang: Lang): Chapter[] {
  if (lang === 'es') return [
    { num: '01', title: 'Panorama de la Industria y Oportunidad', blocks: [
      { kind: 'sub', title: 'Por qué HVAC es diferente a la energía solar' },
      { kind: 'list', title: 'El problema que resolvemos', items: ['Facturas de electricidad altas por sistemas de HVAC ineficientes','Las unidades viejas bajan de 80% de eficiencia a 50% o menos','Los dueños de casa básicamente "tiran gasolina al suelo" con energía desperdiciada'] },
      { kind: 'list', title: 'Ventaja de mercado', items: ['HVAC casi no ha sido tocado por ventas puerta a puerta a gran escala','Las empresas tradicionales son reactivas — nosotros somos proactivos, prevenimos la falla antes de que ocurra','Se necesita menos educación previa que con energía solar','Los clientes ya entienden el valor — solo necesitan soluciones asequibles'] },
      { kind: 'list', title: 'Por qué la gente lo necesita ahora', items: ['Los sistemas viejos están fallando','Las facturas altas están drenando presupuestos','Miedo a que el sistema falle en clima extremo','No hay opciones de financiamiento asequibles de empresas tradicionales'] },
    ]},
    { num: '02', title: 'Tu Rol y Persona', blocks: [
      { kind: 'sub', title: 'Cómo presentarte' },
      { kind: 'list', title: 'Lo que NO eres', items: ['No seas demasiado pulido o "profesional" — esa es la energía de vendedor de solar','No uses ropa elegante que se pueda ensuciar','No finjas saber más de lo que sabes'] },
      { kind: 'list', title: 'Lo que SÍ eres', items: ['Un contratista eléctrico especializado en HVAC','De clase trabajadora, capaz y confiable','Alguien que resuelve el problema'] },
      { kind: 'sub', title: 'Apariencia recomendada' },
      { kind: 'list', title: 'Ropa', items: ['Camisa: camisa de trabajo con cuello y botones — claramente de trabajo, no un polo','Pantalones: pantalones tácticos 5.11 o cargo/shorts','Zapatos: botas de trabajo o zapatos resistentes (Air Max negros o similar)','Consejo: el desgaste visible demuestra que realmente trabajas'] },
      { kind: 'list', title: 'Accesorios', items: ['Linterna (esencial para inspecciones)','Destornillador pequeño (para abrir el horno)','Cinta métrica','Teléfono/iPad para fotos y documentación'] },
    ]},
    { num: '03', title: 'El Enfoque Puerta a Puerta', blocks: [
      { kind: 'sub', title: 'La base: sé directo y simple' },
      { kind: 'text', text: 'Los enfoques de puerta más efectivos son sorprendentemente simples. Complicar de más mata las ventas.' },
      { kind: 'script', title: 'Enfoque #1 — Referencia de vecino', text: 'Hola, soy [Tu Nombre]. Somos contratistas eléctricos. Hemos estado trabajando con algunos de sus vecinos. Nos especializamos en calefacción y aire acondicionado. [Vecino] descubrió que su sistema estaba muy viejo, y hay programas que lo hacen casi gratis. Por eso estamos ofreciendo inspecciones gratis a sus vecinos. Rápido — ¿su unidad está atrás a la izquierda o a la derecha?' },
      { kind: 'list', title: 'Elementos clave', items: ['Apretón de manos firme, contacto visual directo','Menciona "contratistas eléctricos" (no solar — evita que te cierren la puerta)','Haz referencia a un vecino específico','Explica el beneficio — los programas lo hacen casi gratis','Haz una pregunta simple y directa sobre la ubicación de la unidad','No sobre-expliques'] },
      { kind: 'script', title: 'Enfoque #2 — Respaldo de cita', text: 'Hola, veníamos a reunirnos con [vecino] sobre su sistema de calefacción y aire. Van a llegar un par de horas tarde, así que aprovechamos el tiempo. Estamos ofreciendo inspecciones gratis en unidades de HVAC de más de 10 años. ¿Sabe si la suya tiene más o menos de 10 años?' },
      { kind: 'callout', title: 'Regla crítica: el primero en hablar pierde', items: ['Después de preguntar dónde está su unidad — espera','El silencio es incómodo para ellos, no para ti','Si dicen que no → respétalo y sigue adelante','Si dicen que sí → ya están comprometidos'] },
    ]},
    { num: '04', title: 'Proceso de Venta en el Hogar', blocks: [
      { kind: 'sub', title: 'Fase 1 — Inspección de la unidad exterior' },
      { kind: 'list', title: 'Qué hacer', items: ['Camina hacia la unidad de HVAC con confianza','Toma una foto de la unidad de inmediato','Anota el número de modelo y de serie','Da un paso atrás y observa'] },
      { kind: 'script', title: 'Qué decir', text: 'Wow, esta unidad está bastante vieja. Es como un motor diésel grande al lado de su casa.' },
      { kind: 'sub', title: 'Fase 3 — Inspección del horno (generando el dolor)' },
      { kind: 'list', title: 'Lo que normalmente encontrarás', items: ['Agua adentro','Óxido','Escombros','Excremento de animales','Cableado/placa dañados','Moho o humedad'] },
      { kind: 'script', title: 'Cuando ves agua', text: '¿Ve esa agua? Qué bueno que pasé hoy. Los dos sabemos que ahí no debería haber agua. ¿Ve toda esta electrónica expuesta? ¿Qué le pasa al cableado y a la placa cuando les cae agua? Qué bueno que pasé, así no tuvo que lidiar con los problemas que venían.' },
      { kind: 'script', title: 'Cuando ves óxido', text: 'Señor, tiene todo este óxido. ¿Le entra agua aquí? Dios no quiera que llegue a esta placa. Qué alegría haber pasado hoy y hablado con ustedes.' },
      { kind: 'callout', title: 'No lo vuelvas a armar', items: ['Si hay daño visible, deja el horno abierto: "Lo voy a dejar abierto. Se lo vamos a arreglar. No hay problema."'] },
      { kind: 'sub', title: 'Fase 5 — Transición al cierre' },
      { kind: 'script', title: 'Tu frase', text: '¿Dónde puedo sentarme para mostrarle esto?' },
      { kind: 'script', title: 'Construye el caso', text: 'Sr./Sra. [Nombre], qué gusto haber pasado hoy. No vengo a insultar su inteligencia diciendo que está roto — vengo a decirle que necesita resolverlo. Primero: es muy viejo. Segundo: vimos ese daño cuando abrimos el horno. Tercero: si su horno falla, la probabilidad de que su aire acondicionado también falle se duplica o triplica. Mi recomendación: antes de tener que recargar un sistema por $3,000–$5,000, lo reemplazamos.' },
    ]},
    { num: '05', title: 'Manejo de Objeciones', blocks: [
      { kind: 'sub', title: '"No está roto"' },
      { kind: 'script', title: 'Tu respuesta', text: 'No vengo a decirle que está roto. Vengo a decirle que necesita resolverlo. Tiene 30 años. Vimos daño cuando lo abrimos. Y si su horno falla, es mucho más probable que su aire acondicionado también falle. Es como cambiarle el aceite a su carro — se hace mantenimiento antes de que se rompa.' },
      { kind: 'sub', title: '"Lo puedo conseguir más barato"' },
      { kind: 'script', title: 'Tu respuesta', text: 'Claro que puede. Si quiere pagar con tarjeta o cheque, le puedo dar un precio más barato. Pero esto es financiamiento. Cuando compra un carro, ¿paga de contado o lo financia y paga más de lo que vale?' },
      { kind: 'sub', title: '"Lo resolveré cuando se rompa"' },
      { kind: 'script', title: 'Tu respuesta', text: 'Seguro tampoco le cambia el aceite a su carro, ¿verdad? Claro que sí. Tiene 30 años. ¿Qué pasa si falla en agosto cuando hace 100 grados? El técnico de HVAC sabe que está desesperado, así que no le dará buen precio. Pasé hoy para evitar eso.' },
      { kind: 'sub', title: '"No quiero financiar"' },
      { kind: 'script', title: 'Tu respuesta', text: 'Tiene todo el sentido, amigo — yo tampoco quiero. Lo bueno de nuestra membresía es que es como un arrendamiento. No afecta su crédito a menos que no pague. Ahí sí se lo merece en su crédito.' },
      { kind: 'sub', title: '"Necesito pensarlo / hablar con mi pareja"' },
      { kind: 'script', title: 'Tu respuesta', text: 'Lo entiendo perfectamente. Esto es lo que haremos: reviso su crédito rápido. Si lo aprueban, no tiene que hacer nada hoy — pero sabrá que tiene la opción. Cuando hable con su pareja, puede decirle que ya está aprobado y solo falta firmar.' },
    ]},
    { num: '06', title: 'Conocimiento del Producto', blocks: [
      { kind: 'sub', title: 'Las tres opciones de paquete' },
      { kind: 'callout', title: 'Comfort — $3,000 de ganancia', items: ['Reemplazo estándar de horno/aire acondicionado','Cambio básico de equipo','Garantía de 5 años en piezas y servicio','Ideal para: reemplazos sencillos con presupuesto ajustado'] },
      { kind: 'callout', title: 'Comfort Plus — $5,000 de ganancia', items: ['Equipo mejorado','Mejor eficiencia','Garantía ampliada','Ideal para: clientes de rango medio que buscan mejor rendimiento'] },
      { kind: 'callout', title: 'Premium — $6,000 de ganancia', items: ['Sistema dual fuel (bomba de calor + horno)','Actualización de panel a 200 amperios (excelente para clientes solares)','Optimización de flujo de aire — ductos, pruebas de presión','Termostato inteligente + filtración avanzada','Ideal para: la solución completa / clientes solares que necesitan actualizar el panel'] },
    ]},
    { num: '07', title: 'Opciones de Financiamiento', blocks: [
      { kind: 'sub', title: 'Opción 1 — Membresía / PPA' },
      { kind: 'list', title: 'Qué es', items: ['Un acuerdo tipo arrendamiento','Cubre TODO el mantenimiento, garantías, reparaciones y reemplazos','El cliente nunca más se preocupa por el sistema'] },
      { kind: 'list', title: 'Términos', items: ['Pago mensual: $200–$300','Plazo: 20 años','Sin impacto al crédito (a menos que no pague)'] },
      { kind: 'script', title: 'Cómo presentarlo', text: 'Esto cubre todo el mantenimiento, garantías, reparaciones y reemplazos — nunca más se preocupa por eso. Solo un par de cientos de dólares un par de meses después de instalarlo.' },
      { kind: 'sub', title: 'Opción 2 — Préstamo' },
      { kind: 'list', title: 'Términos', items: ['Pago mensual: $200–$300','Plazo: 20 años','Interés: ~11% (estándar para mejoras al hogar)','Puede pagarlo antes sin penalización'] },
      { kind: 'callout', title: 'Estrategia', items: ['Si una opción falla, prueba la otra — diferentes criterios significan diferentes aprobaciones'] },
    ]},
    { num: '08', title: 'Estructura de Comisiones', blocks: [
      { kind: 'sub', title: 'Márgenes de ganancia fijos' },
      { kind: 'list', title: null, items: ['Comfort — $3,000','Comfort Plus — $5,000','Premium — $6,000'] },
      { kind: 'callout', title: 'Estos son fijos', items: ['Ganas lo mismo sin importar el precio final'] },
      { kind: 'sub', title: 'Adicionales (costos extra)' },
      { kind: 'list', title: '¿Qué son?', items: ['Trabajo extra — remoción de caldera, ductos, líneas de gas, etc.','Usualmente $200–$300 por trabajo'] },
      { kind: 'callout', title: 'Ejemplo real', items: ['Remoción de caldera + horno + ductos + líneas de gas = $12,500 en adicionales','El representante aún ganó $4,000 (ganancia de Premium)','La empresa absorbió $1,500, el contratista cubrió el resto'] },
    ]},
    { num: '09', title: 'Lista Rápida de Referencia', blocks: [
      { kind: 'list', title: 'Antes de tocar la puerta', items: ['Ropa de trabajo (no demasiado pulida)','Linterna','Destornillador pequeño','Teléfono/iPad para fotos','Conoce tu guion de puerta','Mentalidad segura'] },
      { kind: 'list', title: 'Al tocar la puerta', items: ['Apretón de manos firme, contacto visual directo','Menciona "contratistas eléctricos"','Haz referencia a un vecino específico','Explica el beneficio (casi gratis)','Pregunta sobre la ubicación de la unidad','Espera la respuesta — el primero en hablar pierde'] },
      { kind: 'list', title: 'Transición y cierre', items: ['Di "¿Dónde puedo sentarme para mostrarle esto?"','Argumenta el caso — viejo, dañado, riesgo de falla','Pregunta: "¿Membresía o préstamo?"','Usa tus guiones para las objeciones','Revisa el crédito, envía documentos, obtén firma'] },
    ]},
    { num: '★', title: 'Recordatorios Finales', blocks: [
      { kind: 'list', title: null, items: ['Menos es más — los discursos simples cierran más tratos','No necesitas ser un experto: "Soy el técnico eléctrico, tenemos un especialista certificado" es una frase completa','Genera dolor, no características — muestra el problema, no des una cátedra de eficiencia','Asume la venta — no vuelvas a armar el horno si hay daño','Mantén la confianza — estás resolviendo un problema real que ya conocen','Pide ayuda cuando la necesites — no adivines tu camino en los tratos'] },
    ]},
  ];

  return [
    { num: '01', title: 'Industry Overview & Opportunity', blocks: [
      { kind: 'sub', title: 'Why HVAC is Different from Solar' },
      { kind: 'list', title: 'The problem we solve', items: ['High power bills caused by inefficient HVAC systems','Old units degrade from 80% efficiency down to 50% or below','Homeowners are essentially "pouring gasoline on the ground" with wasted energy'] },
      { kind: 'list', title: 'Market advantage', items: ['HVAC is virtually untouched by door-to-door sales at scale','Traditional companies are reactive — we are proactive, preventing failure before it happens','Less educational groundwork needed compared to solar','Customers already understand the value — they just need affordable solutions'] },
      { kind: 'list', title: 'Why people need this now', items: ['Aging systems are failing','High utility bills are draining budgets','Fear of system failure during extreme weather','No affordable financing options from traditional companies'] },
    ]},
    { num: '02', title: 'Your Role & Persona', blocks: [
      { kind: 'sub', title: 'How to present yourself' },
      { kind: 'list', title: 'What you are NOT', items: ["Don't be overly polished or professional — that's solar salesman energy","Don't wear fancy clothes that will get dirty","Don't pretend to know more than you do"] },
      { kind: 'list', title: 'What you ARE', items: ['An electrical contractor who specializes in HVAC','Blue-collar, capable, and trustworthy','Someone who gets the job done'] },
      { kind: 'sub', title: 'Recommended appearance' },
      { kind: 'list', title: 'Clothing', items: ['Shirt: collared button-up work shirt — clearly a work shirt, not a polo','Pants: 5.11 tactical pants or cargo pants/shorts','Shoes: work boots or sturdy shoes (black Air Max or similar)','Pro tip: visible wear and tear shows you actually work'] },
      { kind: 'list', title: 'Accessories', items: ['Flashlight (essential for inspections)','Small screwdriver (for furnace access)','Measuring tape','Phone/iPad for photos and documentation'] },
    ]},
    { num: '03', title: 'Door-to-Door Approach', blocks: [
      { kind: 'sub', title: 'The foundation: be direct & simple' },
      { kind: 'text', text: 'The most effective door approaches are surprisingly simple. Overcomplicating kills deals.' },
      { kind: 'script', title: 'Approach #1 — Neighbor reference', text: "Hey, I'm [Your Name]. We're just electrical contractors. We've been working with some of your neighbors. We specialize in heating and cooling. [Neighbor] found that his system was super old, and there are programs out there that make it close to free. So we're out here offering free inspections for his neighbors. Real quick — is your unit on the back left or right?" },
      { kind: 'list', title: 'Key elements', items: ['Firm handshake, direct eye contact','Mention electrical contractors (not solar — avoids door slamming)','Reference a specific neighbor','Explain the benefit — programs make it close to free','Ask a simple, direct question about unit location',"Don't over-explain"] },
      { kind: 'script', title: 'Approach #2 — Appointment backup', text: "Hey, we were here to meet with [neighbor] about their heating and cooling system. They're running a couple hours late, so we're trying to make the best use of our time. We're offering free inspections on HVAC units more than 10 years old. Do you know if yours is more or less than 10 years old?" },
      { kind: 'callout', title: 'Critical rule: first person to talk loses', items: ['After you ask where their unit is — wait','Silence is uncomfortable for them, not you','If they say no → respect it and move on',"If they say yes → they're already committed"] },
    ]},
    { num: '04', title: 'In-Home Sales Process', blocks: [
      { kind: 'sub', title: 'Phase 1 — Exterior unit inspection' },
      { kind: 'list', title: 'What you do', items: ['Walk to the HVAC unit with confidence','Immediately take a photo of the unit','Get the model number and serial number','Take a step back and observe'] },
      { kind: 'script', title: 'What you say', text: "Wow, this unit's pretty old. It's like a big diesel motor on the side of your house." },
      { kind: 'sub', title: 'Phase 3 — Furnace interior inspection (the pain builder)' },
      { kind: 'list', title: "What you'll usually find", items: ['Water inside','Rust','Debris','Animal droppings','Damaged wiring / motherboard','Mold or mildew'] },
      { kind: 'script', title: 'When you see water', text: "You see that water? Such a good thing I stopped today. We both know water is not supposed to be in there. You see all these electronics exposed? What happens to wiring and motherboards when water gets on it? Good thing I stopped by, so you didn't have to deal with the problems about to happen." },
      { kind: 'script', title: 'When you see rust', text: "Sir, you have all this rust. You getting water in here? God forbid it hits this motherboard. I'm so glad I stopped today and talked to you guys." },
      { kind: 'callout', title: "Don't reassemble", items: ['If there is visible damage, leave the furnace open: "I\'m going to leave it open. We\'ll get this fixed for you. No big deal."'] },
      { kind: 'sub', title: 'Phase 5 — Transition to close' },
      { kind: 'script', title: 'Your line', text: "Where's somewhere I can sit so I can show this to you?" },
      { kind: 'script', title: 'Build the case', text: "Mr./Ms. [Name], I'm so glad I stopped today. I'm not here to insult your intelligence and say it's broken — I'm here to tell you that you need to get it done. Number one: it's super old. Number two: we saw that damage when we opened the furnace. Number three: if your furnace goes down, the odds your AC goes down more than double or triple. My recommendation: before you have to recharge a system for $3,000–$5,000, we get this replaced." },
    ]},
    { num: '05', title: 'Objection Handling', blocks: [
      { kind: 'sub', title: '"It\'s not broken"' },
      { kind: 'script', title: 'Your response', text: "I'm not here to tell you it's broken. I'm here to tell you that you need to get it done. It's 30 years old. We saw damage when we opened it up. And if your furnace goes down, your AC is much more likely to fail too. This is like changing the oil in your car — you do maintenance before it breaks." },
      { kind: 'sub', title: '"I can find it cheaper"' },
      { kind: 'script', title: 'Your response', text: "You absolutely can. If you want to swipe a card or write me a check, I can get you a cheaper deal. But this is financing. When you buy a car, do you pay cash or finance it and pay more than it's worth?" },
      { kind: 'sub', title: '"I\'ll deal with it when it breaks"' },
      { kind: 'script', title: 'Your response', text: "You probably don't change the oil in your car either, do you? Of course you do. It's 30 years old. What happens if it goes out in August when it's 100 degrees? The HVAC guy knows you're desperate, so he won't give you a good deal. I stopped by today to prevent that." },
      { kind: 'sub', title: '"I don\'t want to finance"' },
      { kind: 'script', title: 'Your response', text: "That makes total sense, man — neither do I. The cool part about our membership is it's a lease. It's not on your credit unless you don't pay it. Then you kind of deserve it on your credit." },
      { kind: 'sub', title: '"I need to think about it / talk to my spouse"' },
      { kind: 'script', title: 'Your response', text: "I totally understand. Here's what we'll do: I'll run your credit real quick. If you get approved, you don't have to do anything today — but you'll know you have the option. When you talk to your spouse, you can tell them you're approved and just need to sign." },
    ]},
    { num: '06', title: 'Product Knowledge', blocks: [
      { kind: 'sub', title: 'The three package options' },
      { kind: 'callout', title: 'Comfort — $3,000 profit', items: ['Standard furnace/AC replacement','Basic equipment swap','5-year parts & service warranty','Best for: budget-conscious, straightforward replacements'] },
      { kind: 'callout', title: 'Comfort Plus — $5,000 profit', items: ['Upgraded equipment','Better efficiency','Enhanced warranty','Best for: mid-range customers wanting better performance'] },
      { kind: 'callout', title: 'Premium — $6,000 profit', items: ['Dual fuel system (heat pump + furnace)','200-amp panel upgrade (great for solar customers)','Airflow optimization — ductwork, pressure testing','Smart thermostat + advanced filtration','Best for: the complete solution / solar customers needing a panel upgrade'] },
      { kind: 'sub', title: 'Why dual fuel is amazing' },
      { kind: 'list', title: 'What it is', items: ['A heat pump (electric) + furnace (gas) system','Uses the most efficient heating method automatically','Heat pump in spring/fall, furnace in deep winter'] },
      { kind: 'script', title: 'Selling point', text: "This system will give you better comfort than you've ever had. Every customer I've put this in loves it." },
    ]},
    { num: '07', title: 'Financing Options', blocks: [
      { kind: 'sub', title: 'Option 1 — Membership / PPA' },
      { kind: 'list', title: 'What it is', items: ['A lease-like agreement','Covers ALL maintenance, warranties, repairs, and replacements','Customer never worries about the system again'] },
      { kind: 'list', title: 'Terms', items: ['Monthly payment: $200–$300','Term: 20 years','No credit impact (unless they don\'t pay)'] },
      { kind: 'script', title: 'How to pitch', text: "This covers all maintenance, warranties, repairs, replacements — you never worry about it again. Just a couple hundred bucks a couple months after we install it." },
      { kind: 'sub', title: 'Option 2 — Loan' },
      { kind: 'list', title: 'Terms', items: ['Monthly payment: $200–$300','Term: 20 years','Interest: ~11% (standard for home improvement)','Pay off early without penalty'] },
      { kind: 'callout', title: 'Strategy', items: ['If one option fails, try the other — different criteria means different approvals'] },
      { kind: 'sub', title: 'What NOT to over-explain' },
      { kind: 'list', title: null, items: ["Don't detail interest rates unless asked","Don't explain PPA vs lease","Don't complicate the close with rebates or incentives",'Keep it simple: "Your payment is $X and it never changes."'] },
    ]},
    { num: '08', title: 'Commission Structure', blocks: [
      { kind: 'sub', title: 'Fixed profit margins' },
      { kind: 'list', title: null, items: ['Comfort — $3,000','Comfort Plus — $5,000','Premium — $6,000'] },
      { kind: 'callout', title: 'These are fixed', items: ['You make the same amount regardless of final price'] },
      { kind: 'sub', title: 'Adders (additional costs)' },
      { kind: 'list', title: 'What are they?', items: ['Extra work — boiler removal, ductwork, gas line runs, etc.','Usually $200–$300 per job'] },
      { kind: 'callout', title: 'Real example', items: ['Boiler removal + furnace + ductwork + gas lines = $12,500 in adders','Rep still made $4,000 (Premium profit)','Company absorbed $1,500, contractor ate the rest'] },
    ]},
    { num: '09', title: 'Quick Reference Checklist', blocks: [
      { kind: 'list', title: 'Pre-door knock', items: ['Work clothes (not overly polished)','Flashlight','Small screwdriver','Phone/iPad for photos','Know your door approach script','Confident mindset'] },
      { kind: 'list', title: 'Door knock', items: ['Firm handshake, direct eye contact','Mention "electrical contractors"','Reference a specific neighbor','Explain the benefit (close to free)','Ask about unit location','Wait for response — first to talk loses'] },
      { kind: 'list', title: 'Transition & close', items: ['Say "Where can I sit so I can show this to you?"','Make the case — old, damaged, risk of failure','Ask: "Membership or loan?"','Use your scripts on objections','Run credit, send documents, get signature'] },
    ]},
    { num: '★', title: 'Final Reminders', blocks: [
      { kind: 'list', title: null, items: ['Less is more — simpler pitches close more deals','You don\'t need to be an expert: "I\'m the electrical guy, we have a certified tech" is a complete sentence',"Build pain, not features — show the problem, don't lecture about efficiency","Assume the sale — don't put the furnace back together if there's damage","Stay confident — you're solving a real problem they already know they have","Ask for help when you need it — don't guess your way through deals"] },
    ]},
  ];
}

// ── Map component ────────────────────────────────────────────────────────────
function CoverageMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const [d3mod, topomod] = await Promise.all([
        import('d3'),
        import('topojson-client'),
      ]);
      if (cancelled) return;
      const d3 = d3mod;
      const topojson = topomod;
      const usData: any = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json');
      if (cancelled || !mapRef.current) return;

      const states = topojson.feature(usData, usData.objects.states).features
        .filter((f: any) => f.id !== '02' && f.id !== '15' && +f.id <= 56);

      const W = 960, H = 600;
      const proj = d3.geoAlbersUsa().fitSize([W, H], { type: 'FeatureCollection', features: states } as any);
      const gp = d3.geoPath(proj);

      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.style.display = 'block';

      const tooltip = tooltipRef.current!;

      states.forEach((f: any) => {
        const avail = AVAIL_STATES.has(f.properties.name);
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', gp(f) || '');
        p.setAttribute('fill', avail ? ACCENT : '#1c2123');
        p.setAttribute('stroke', '#0b0e0d');
        p.setAttribute('stroke-width', '1');
        p.setAttribute('stroke-linejoin', 'round');
        p.style.transition = 'opacity .15s ease';
        p.style.cursor = 'default';
        p.addEventListener('mouseenter', () => {
          p.style.opacity = '0.8';
          tooltip.textContent = `${f.properties.name} — ${avail ? 'Service available' : 'Not available'}`;
          tooltip.style.opacity = '1';
        });
        p.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = mapRef.current!.getBoundingClientRect();
          tooltip.style.left = (e.clientX - rect.left) + 'px';
          tooltip.style.top = (e.clientY - rect.top) + 'px';
        });
        p.addEventListener('mouseleave', () => {
          p.style.opacity = '1';
          tooltip.style.opacity = '0';
        });
        svg.appendChild(p);
      });

      mapRef.current.innerHTML = '';
      mapRef.current.appendChild(svg);
    }
    init().catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <section style={{ position: 'relative', background: 'linear-gradient(180deg,#0f1314 0%,#0c0f10 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '30px clamp(18px,3vw,34px) 24px', boxShadow: '0 30px 80px -40px rgba(0,0,0,0.8)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(700px 360px at 50% -30%, rgba(155,217,189,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.4em', color: '#6b736e', marginBottom: 12 }}>HVAC INSTALLATION</div>
        <h1 style={{ margin: 0, fontSize: 'clamp(40px,6.4vw,66px)', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>
          <span style={{ color: '#e9efea', fontWeight: 400 }}>RIV</span>{' '}
          <span style={{ color: ACCENT, fontWeight: 700 }}>COMFORT</span>
        </h1>
        <div style={{ width: 52, height: 3, borderRadius: 3, background: ACCENT, margin: '18px auto 0', opacity: 0.85 }} />
      </div>
      <div style={{ position: 'relative', maxWidth: 880, margin: '14px auto 0' }}>
        <div ref={mapRef} style={{ aspectRatio: '960/600', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a413e', fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.2em' }}>
          LOADING COVERAGE…
        </div>
        <div ref={tooltipRef} style={{ position: 'absolute', pointerEvents: 'none', background: '#141719', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, padding: '7px 11px', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.1em', color: '#eef1ef', whiteSpace: 'nowrap', opacity: 0, transition: 'opacity .1s ease', transform: 'translate(-50%,-130%)', zIndex: 5 }} />
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 13, height: 13, borderRadius: 3, background: '#9bd9bd', display: 'inline-block' }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.16em', color: '#aeb4b0' }}>SERVICE AVAILABLE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 13, height: 13, borderRadius: 3, background: '#262b2d', display: 'inline-block' }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.16em', color: '#6b726e' }}>NOT AVAILABLE</span>
          </div>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.12em', color: ACCENT, background: '#13181a', border: '1px solid rgba(155,217,189,0.18)', borderRadius: 999, padding: '8px 16px' }}>30 States</div>
      </div>
    </section>
  );
}

// ── Block renderer ────────────────────────────────────────────────────────────
function BlockItem({ b }: { b: Block }) {
  if (b.kind === 'sub') {
    return <h4 style={{ margin: '24px 0 2px', fontFamily: "'Space Mono',monospace", fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: ACCENT }}>{b.title}</h4>;
  }
  if (b.kind === 'text') {
    return <p style={{ margin: '14px 0 0', fontSize: 15, lineHeight: 1.6, color: '#aeb4b0' }}>{b.text}</p>;
  }
  if (b.kind === 'list') {
    return (
      <div style={{ margin: '15px 0 0' }}>
        {b.title && <div style={{ fontSize: 14, fontWeight: 700, color: '#dfe4e0', marginBottom: 9 }}>{b.title}</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {b.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.55, color: '#9aa19b' }}>
              <span style={{ color: ACCENT, flexShrink: 0, fontFamily: "'Space Mono',monospace" }}>—</span>
              <span style={{ flex: 1 }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (b.kind === 'script') {
    return (
      <div style={{ margin: '16px 0 0', background: '#0e1513', border: '1px solid rgba(155,217,189,0.15)', borderLeft: '3px solid ' + ACCENT, borderRadius: '0 12px 12px 0', padding: '15px 20px' }}>
        {b.title && <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7fb89e', marginBottom: 9 }}>{b.title}</div>}
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: '#d9e7df', fontStyle: 'italic' }}>{b.text}</p>
      </div>
    );
  }
  if (b.kind === 'callout') {
    return (
      <div style={{ margin: '16px 0 0', background: '#15191b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '15px 20px' }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c2c8c3', marginBottom: 11 }}>{b.title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {b.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.55, color: '#aeb4b0' }}>
              <span style={{ color: ACCENT, flexShrink: 0, fontSize: 9, lineHeight: 1.9 }}>◾</span>
              <span style={{ flex: 1 }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// ── Chapter accordion ────────────────────────────────────────────────────────
function Chapter({ ch }: { ch: Chapter }) {
  const [open, setOpen] = useState(false);
  return (
    <article style={{ background: '#141719', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 15, overflow: 'hidden', transition: 'border-color .18s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(155,217,189,0.2)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%', cursor: 'pointer', background: 'transparent', border: 'none', textAlign: 'left', padding: '21px 24px' }}>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', color: ACCENT, minWidth: 26 }}>{ch.num}</span>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', color: '#f1f4f1', lineHeight: 1.2 }}>{ch.title}</span>
        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, lineHeight: 1, color: ACCENT, width: 18, textAlign: 'center' }}>{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '2px 24px 26px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {ch.blocks.map((b, i) => <BlockItem key={i} b={b} />)}
        </div>
      )}
    </article>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function downloadFile(path: string) {
  const url = BASE + path;
  const a = document.createElement('a');
  a.href = url;
  a.download = path.split('/').pop() || path;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function HvacGuide() {
  const [lang, setLang] = useState<Lang>('en');
  const [, navigate] = useLocation();
  const t = T[lang];
  const resources = getResources(lang);
  const course = buildCourse(lang);

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1100px 560px at 50% -12%, rgba(155,217,189,0.10) 0%, rgba(155,217,189,0) 58%), #0b0e0d', color: '#eef1ef', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '30px clamp(16px,4vw,48px) 96px' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div style={{ width: 11, height: 11, borderRadius: '50%', background: '#9bd9bd', boxShadow: '0 0 14px rgba(155,217,189,0.6)', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 'clamp(12px,3.2vw,13px)', letterSpacing: '0.22em', fontWeight: 700, color: '#eef1ef', whiteSpace: 'nowrap' }}>RIV&nbsp;COMFORT</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 'clamp(11px,3vw,13px)', letterSpacing: '0.22em', color: '#5f6661', whiteSpace: 'nowrap' }}>/ HVAC 101</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 10 }}>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.26em', color: '#5f6661', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '6px 13px', whiteSpace: 'nowrap' }}>{t.fieldGuide}</span>
            <button onClick={() => navigate('/portal')} style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: '0.2em', color: ACCENT, border: '1px solid rgba(155,217,189,0.28)', borderRadius: 999, padding: '6px 13px', textDecoration: 'none', whiteSpace: 'nowrap', background: 'transparent', cursor: 'pointer' }}>{t.repPortal}</button>
            <div style={{ display: 'flex', alignItems: 'center', background: '#141719', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: 3 }}>
              <button onClick={() => setLang('en')} style={{ cursor: 'pointer', border: 'none', borderRadius: 999, padding: '6px 12px', fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', background: lang === 'en' ? ACCENT : 'transparent', color: lang === 'en' ? '#0b0e0d' : '#8a908b', transition: 'background .15s, color .15s' }}>EN</button>
              <button onClick={() => setLang('es')} style={{ cursor: 'pointer', border: 'none', borderRadius: 999, padding: '6px 12px', fontFamily: "'Space Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', background: lang === 'es' ? ACCENT : 'transparent', color: lang === 'es' ? '#0b0e0d' : '#8a908b', transition: 'background .15s, color .15s' }}>ES</button>
            </div>
          </div>
        </header>

        {/* Map */}
        <CoverageMap />

        {/* Resources */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '46px 4px 22px' }}>
          <h2 style={{ margin: 0, fontSize: 21, fontWeight: 600, letterSpacing: '-0.01em', color: '#eef1ef' }}>{t.fieldResources}</h2>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.18em', color: '#5f6661' }}>{resources.length} {t.documents}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {resources.map((r, i) => (
            <article key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', background: '#141719', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 15, padding: '24px 24px 22px', transition: 'border-color .18s, transform .18s, box-shadow .18s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(155,217,189,0.28)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 24px 50px -34px rgba(0,0,0,0.9)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.26em', color: '#7f867f' }}>{r.tag}</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: '0.2em', color: '#c2c8c3', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: '4px 10px' }}>{r.kind}</span>
              </div>
              <h3 style={{ margin: '18px 0 0', fontSize: 21, fontWeight: 700, letterSpacing: '-0.01em', color: '#f1f4f1', lineHeight: 1.15 }}>{r.title}</h3>
              <p style={{ margin: '9px 0 0', fontSize: 14, lineHeight: 1.5, color: '#878e88' }}>{r.desc}</p>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '22px 0 18px' }} />
              <div style={{ marginTop: 'auto' }}>
                {'file' in r ? (
                  <button onClick={() => downloadFile(r.file!)} style={{ width: '100%', cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, color: '#0b0e0d', background: ACCENT, border: 'none', borderRadius: 9, padding: '13px 0', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#b6e6cf')} onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                  >{t.download}</button>
                ) : (
                  <button onClick={() => window.open(r.url, '_blank', 'noopener')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.2em', fontWeight: 700, color: '#0b0e0d', background: ACCENT, border: 'none', borderRadius: 9, padding: '13px 0', transition: 'background .15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#b6e6cf')} onMouseLeave={e => (e.currentTarget.style.background = ACCENT)}
                  >{r.cta} <span style={{ fontSize: 11 }}>↗</span></button>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Course */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', margin: '64px 4px 22px' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.26em', color: '#7f867f', marginBottom: 10 }}>INTERNAL SALES COURSE</div>
            <h2 style={{ margin: 0, fontSize: 27, fontWeight: 600, letterSpacing: '-0.015em', color: '#eef1ef' }}>{t.courseTitle}</h2>
          </div>
          <button onClick={() => downloadFile('assets/selling_hvac_course_manual.pdf')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: ACCENT, background: 'transparent', border: '1px solid rgba(155,217,189,0.3)', borderRadius: 9, padding: '11px 16px', transition: 'background .15s, border-color .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(155,217,189,0.1)'; e.currentTarget.style.borderColor = 'rgba(155,217,189,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(155,217,189,0.3)'; }}
          >{t.downloadFullPdf} <span style={{ fontSize: 13 }}>↓</span></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {course.map((ch, i) => <Chapter key={i} ch={ch} />)}
        </div>

        {/* Site visit image */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ margin: '0 0 18px', fontSize: 27, fontWeight: 600, letterSpacing: '-0.015em', color: '#eef1ef', textAlign: 'center' }}>{t.siteVisitTitle}</h2>
          <img src={BASE + 'assets/site_visit_photo_checklist.png'} alt="Site visit checklist" style={{ display: 'block', width: '100%', maxWidth: 1180, margin: '0 auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, background: '#0b0e0d' }} />
        </div>

      </div>
    </div>
  );
}
