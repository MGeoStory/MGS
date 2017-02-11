import * as d3 from 'd3';
import { GraphFrame } from 'app/shared/graph-frame';

//that's extends could work probably, but the problem is how to super(parms)?
export class GraphCanvas extends GraphFrame {
    constructor() {
        super();
    };
    
    setFrameWidth(width: number) {
        super.setFrameWidth(width);
    };
 
    getFrameWidth(): number {
        return super.getFrameWidth();
    }

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
    /**
    * create a responsive embedded D3 SVG (graph frame)
    */
    addFrame(htmlElement: any): d3.Selection<any, any, any, any> {
        return super.addFrame(htmlElement);
    }

}// END OF GraphCanvas