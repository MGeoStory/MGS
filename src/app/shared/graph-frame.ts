import * as d3 from 'd3';

//this class is the frame of graph
export class GraphFrame {
    frame: d3.Selection<any, any, any, any>;
    width: number;
    height: number;
    margin: { top: number, right: number, bottom: number, left: number };

    constructor() {
        //phone6s size: 414x736
        this.width = 414;
        this.height = 300;

        //nargin.top and margin.left are used in Frame and Canvas.
        this.margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        }
    }

    setFrame(htmlElement: any): d3.Selection<any, any, any, any> {
        //append svg是為 了透過attr改變view(CSS可連動),if style則無法透過css覆寫
        //frame留白
        //http://www.oxxostudio.tw/articles/201409/svg-23-viewpoint-viewBox.html
        let width = this.width + this.margin.left + this.margin.right;
        let height = this.height + this.margin.top + this.margin.bottom;
        return this.frame = d3.select(htmlElement).append('svg')
            .attr('width', '100%')
            .attr('height', height)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", "0 0 " + width + " " + height);

        // return this.frame = d3.select(htmlElement).append('svg')
        //     .attr('width', this.width + this.margin.left + this.margin.right)
        //     .attr('height', this.height + this.margin.top + this.margin.bottom);
    };
}