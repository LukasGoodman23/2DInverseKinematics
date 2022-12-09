"use strict"

class Arm
{
    constructor (l1, l2, t1, t2, x, y, bX, bY)
    {
        this.length1= l1;
        this.length2= l2;
        this.x= x;
        this.y= y;
        this.baseX= bX;
        this.baseY= bY;
        this.theta1= t1;
        this.theta2= t2;
        this.toTheta1= 0;
        this.toTheta2= 0;
        this.timerPosition= 0;
    }

    inverseKinematics()
    {
        //x^2 + y^2 - l1^2 - l2^2
        const term1= (this.x-this.baseX) * (this.x-this.baseX) + (this.y-this.baseY) * (this.y-this.baseY) - this.length1 * this.length1 - this.length2 * this.length2;
        //2*l1*l2
        const term2= 2 * this.length1 * this.length2;
        //(x^2 + y^2 - l1^2 - l2^2) / (2*l1*l2)
        const term3= term1 / term2;
        //cos^-1((x^2 + y^2 - l1^2 - l2^2) / (2*l1*l2))
        this.toTheta2= Math.acos(term3);

        //l2 * sin(theta2)
        const a= this.length2 * Math.sin(this.toTheta2);

        //l1 + l2 * cos(theta2)
        const b= this.length1 + this.length2 * Math.cos(this.toTheta2);

        //tan^-1(y/x) - tan^-1( (l2 * sin(theta2)) / (l1 + l2 * cos(theta2)) )
        this.toTheta1= Math.atan((this.y-this.baseY) / (this.x-this.baseX)) - Math.atan(a / b);

        //fix angles if the arm is below to the x-axis
        const angle= this.length1 * Math.sin(this.toTheta1);
        if (angle < 0)
        {
            const h= Math.sqrt(((this.x-this.baseX) * (this.x-this.baseX)) + ((this.y-this.baseY) * (this.y-this.baseY)));
            const thetaH= Math.acos((this.x-this.baseX)/h);
            
            this.toTheta1= thetaH*2 + this.toTheta1 *-1;
            this.toTheta2*= -1;
        }
        
    }

    drawDot(ctx, x,y)
    {
        ctx.lineWidth= 1;
        ctx.beginPath();
        ctx.arc(x,y,8,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    drawSegment(ctx, startX, startY, length, angle)
    {
        this.drawDot(ctx, startX, startY);

        ctx.lineWidth= 4;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo((startX + length*Math.cos(angle)) , (startY - length*Math.sin(angle)));
        ctx.stroke();
        this.drawDot(ctx, (startX + length*Math.cos(angle)), (startY - length*Math.sin(angle)));
    }  

    drawArm(canvas)
    {
        let ctx= canvas.getContext('2d');
        this.drawDot(ctx, this.baseX, canvas.height-this.baseY);
        this.drawSegment(ctx, this.baseX, canvas.height-this.baseY, this.length1, this.theta1);
        this.drawDot(ctx, (this.length1*Math.cos(this.theta1))+this.baseX, canvas.height-(this.length1*Math.sin(this.theta1))-this.baseY);
        this.drawSegment(ctx, (this.length1*Math.cos(this.theta1))+this.baseX, canvas.height-(this.length1*Math.sin(this.theta1))-this.baseY, this.length2, this.theta2 + this.theta1);
    }
    
    tick(timerLength)
    {
        this.theta1+= (this.toTheta1-this.theta1) * (this.timerPosition/(1000/timerLength));
        this.theta2+= (this.toTheta2-this.theta2) * (this.timerPosition/(1000/timerLength));
    }
}