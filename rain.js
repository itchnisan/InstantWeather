/*<style>
        body{
            background-color: rgb(18, 18, 59);
            overflow: hidden;
        }
        canvas{
            
            top:  0;
            left: 0;
            bottom: 0;
            right: 0;
        }

    </style>

    <canvas id = "rain"></canvas>
*/



const canvas = document.getElementById("rain");
        const ctx = canvas.getContext('2d');

        canvas.height = window.innerWidth;
        canvas.width = window.innerHeight;

        const raindrop = [] ;

        function createRaindrop(){
            const x = Math.random() * canvas.width;
            const y = -5;
            const speed = Math.random() * 5 + 2;
            const length = Math.random() * 20 + 10;


            raindrop.push({x,y,speed,length});
        }

        function updateRainDrops(){
            for(let i = 0;i < raindrop.length ;i++){
                const drop = raindrop[i];

                drop.y += drop.speed;

                if(drop.y > canvas.height){
                    raindrop.splice(i,1);
                    i--;
                }
            }
        }

        function drawRaindrop(){
            ctx.clearRect(0,0,canvas.width,canvas.height);


            ctx.strokeStyle ='white';
            ctx.lineWidth = 2;

            for(let i = 0;i < raindrop.length ;i++){
                const drop = raindrop[i];

                ctx.beginPath();
                ctx.moveTo(drop.x,drop.y);
                ctx.lineTo(drop.x,drop.y + drop.length);
                ctx.stroke();

        }
    }
        function animate(){
            createRaindrop();
            updateRainDrops();
            drawRaindrop();

            requestAnimationFrame(animate);


        }
    

    animate();
