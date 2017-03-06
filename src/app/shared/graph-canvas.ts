import * as d3 from 'd3';
import { GraphFrame } from 'app/shared/graph-frame';

//that's extends could work probably, but the problem is how to super(parms)?
export class GraphCanvas extends GraphFrame {
    canvas: d3.Selection<any, any, any, any>;
    xScaleBand: d3.ScaleBand<String>;
    yScaleLinear: d3.ScaleLinear<number, number>;
    constructor() {
        super();
        this.xScaleBand = d3.scaleBand().range([0, this.getFrameWidth()]).paddingInner(0.1);
        this.yScaleLinear = d3.scaleLinear().range([this.getFrameHeight(),0]);
    };
    /**
     * the gFrame is the id of Frame; it was created by createCanvasT extends graph-frame.addFrame;
     * 
     */
    removeCanvas():void{
        d3.selectAll('#graph-frame').remove();
    }
    /**
    * create a responsive embedded D3 SVG (graph frame adn canvas)
    */
    createCanvas(htmlElement: any): d3.Selection<any, any, any, any> {
        return this.canvas = super.createFrame(htmlElement).append('g')
            .attr('transform', 'translate(' + this.getFrameMargin()['left'] + ',' + this.getFrameMargin()['top'] + ')');
    }

    setFrameWidth(width: number) {
        super.setFrameWidth(width);
    };

    getFrameWidth(): number {
        return super.getFrameWidth();
    }
    /**
     * the height shold be small than 300 (the size of frame).
     * If not, the graph would out of viewbox.
     */
    setFrameHeight(height: number) {
        super.setFrameHeight(height);
    };
    getFrameHeight(): number {
        return super.getFrameHeight();
    };
    /** 
   *if parms = -1 => keep the value that constructor create.
   */
    setFrameMargin(top: number, right: number, bottom: number, left: number) {
        super.setFrameMargin(top, right, bottom, left);
    };
    getFrameMargin() {
        return super.getFrameMargin();
    }
}// END OF GraphCanvas