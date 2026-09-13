const orden=['0','28','9','26','30','11','7','20','32','17','5','22','34','15','3','24','36','13','1','00','27','10','25','29','12','8','19','31','18','6','21','33','16','4','23','35','14','2'];
const rojos=new Set(['1','3','5','7','9','12','14','16','18','19','21','23','25','27','30','32','34','36']);

// NUEVO MODO 18: 19 combinaciones (0/00, 1/2, 3/4 ... 35/36).
// Cada combinación tiene 36 números sombreados y 2 sin sombrear:
// 6 amarillos + 6 azules + 6 rosados por cada lado.
// Reconstrucción de las 19 combinaciones con el formato exacto de cada lado.
const modos18={};
function lado18(base, invertirAmarillo=true){
    const total=orden.length;
    const i=orden.indexOf(base);
    const amarilloBase=[
        orden[(i-3+total)%total],orden[(i-2+total)%total],orden[(i-1+total)%total],
        orden[i],orden[(i+1)%total],orden[(i+2)%total]
    ];
    const amarillo=invertirAmarillo?[...amarilloBase].reverse():amarilloBase;
    const azul=[];
    const rosado=[];
    for(let paso=4;paso<=9;paso++) azul.push(orden[(i-paso+total)%total]);
    for(let paso=10;paso<=15;paso++) rosado.push(orden[(i-paso+total)%total]);
    return {amarillo,azul,rosado,sinSombrear:orden[(i-16+total)%total]};
}

modos18['0']={izquierda:lado18('0',false),derecha:lado18('00',true)};
for(let n=1;n<=35;n+=2){
    modos18[`${n}-${n+1}`]={izquierda:lado18(String(n+1),true),derecha:lado18(String(n),true)};
}

let modo='18';
const b18=document.getElementById('modo18');
const bManual=document.getElementById('modoManual');
const b10x10=document.getElementById('modo10x10');
if(b18) b18.onclick=()=>modo='18';
if(bManual) bManual.onclick=()=>modo='manual';
if(b10x10) b10x10.onclick=()=>modo='10x10';

const r=document.getElementById('ruleta');
const c=450,rad=390;
orden.forEach((n,i)=>{
    let d=document.createElement('div');
    d.className='num';
    d.textContent=n;
    d.style.background=(n==='0'||n==='00')?'green':(rojos.has(n)?'#c40000':'black');
    d.dataset.baseColor=d.style.background;
    let a=i/38*2*Math.PI-Math.PI/2;
    d.style.left=(c+Math.cos(a)*rad-29)+'px';
    d.style.top=(c+Math.sin(a)*rad-29)+'px';

    d.onclick=()=>{
        if(modo==='manual'){
            d.classList.toggle('off');
            return;
        }

        document.querySelectorAll('.num').forEach(x=>{
            x.classList.remove('off','figuraAzul','modo18Azul','modo18Rosado');
            if(x.dataset.baseColor){
                x.style.background=x.dataset.baseColor;
                x.style.color='#fff';
                x.style.border='';
            }
        });

        if(modo==='18'){
            let clave;
            if(n==='0'||n==='00') clave='0';
            else if(Number(n)%2===1) clave=`${n}-${Number(n)+1}`;
            else clave=`${Number(n)-1}-${n}`;

            const combo=modos18[clave];
            const lados=[combo.izquierda,combo.derecha];

            lados.forEach(lado=>{
                lado.amarillo.forEach(numero=>{
                    document.querySelectorAll('.num').forEach(casilla=>{
                        if(casilla.textContent===numero){
                            casilla.classList.add('off');
                        }
                    });
                });
                lado.azul.forEach(numero=>{
                    document.querySelectorAll('.num').forEach(casilla=>{
                        if(casilla.textContent===numero){
                            casilla.classList.add('modo18Azul');
                            casilla.style.background='#00E5FF';
                            casilla.style.color='#000';
                            casilla.style.border='3px solid #0057FF';
                        }
                    });
                });
                lado.rosado.forEach(numero=>{
                    document.querySelectorAll('.num').forEach(casilla=>{
                        if(casilla.textContent===numero){
                            casilla.classList.add('modo18Rosado');
                            casilla.style.background='#FF69B4';
                            casilla.style.color='#000';
                            casilla.style.border='3px solid #C2185B';
                        }
                    });
                });
            });
            return;
        }

        if(modo==='10x10'){
            const total=orden.length;
            const indice=orden.indexOf(n);
            const centroDerecha=(indice+10)%total;
            const centroIzquierda=(indice-10+total)%total;
            const construirGrupo=(centro)=>[
                orden[centro],
                orden[(centro-1+total)%total],
                orden[(centro-2+total)%total],
                orden[(centro-3+total)%total],
                orden[(centro+1)%total],
                orden[(centro+2)%total]
            ];
            const lista=[...construirGrupo(centroIzquierda),...construirGrupo(centroDerecha)];
            const azulesIzquierda=[];
            for(let paso=7;paso<=12;paso++) azulesIzquierda.push(orden[(centroIzquierda-paso+total)%total]);
            const azulesDerecha=[];
            for(let paso=8;paso<=13;paso++) azulesDerecha.push(orden[(centroDerecha-paso+total)%total]);
            const azules10x10=[...azulesIzquierda,...azulesDerecha];
            azules10x10.forEach(numero=>{
                document.querySelectorAll('.num').forEach(casilla=>{
                    if(casilla.textContent===numero){
                        casilla.classList.remove('off');
                        casilla.classList.add('figuraAzul');
                        casilla.style.background='#00E5FF';
                        casilla.style.color='#000';
                        casilla.style.border='3px solid #0057FF';
                    }
                });
            });
            lista.forEach(numero=>{
                document.querySelectorAll('.num').forEach(casilla=>{
                    if(casilla.textContent===numero) casilla.classList.add('off');
                });
            });
        }
    };
    r.appendChild(d);
});

document.getElementById('limpiar').onclick=()=>document.querySelectorAll('.num').forEach(x=>{
    x.classList.remove('off','figuraAzul','modo18Azul','modo18Rosado');
    if(x.dataset.baseColor){
        x.style.background=x.dataset.baseColor;
        x.style.color='#fff';
        x.style.border='';
    }
});
