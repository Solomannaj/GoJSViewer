import React, { Component } from 'react';
import NodeDataArray from './datafiles/NodeDataArray.json'
import LinkDataArray from './datafiles/linkDataArray.json'
// import { node, link } from './models/viewermodel'
import * as go from 'gojs';
import { GoJsDraw, myDiagram, searchNodesArray, searchDiagramExtended, searchDiagram } from './demo';

export default class App extends Component {

  nodeIgnoreText: string = "Not allowed";
  model: go.Model;
  nodeDataArray: any = [];
  linkDataArray: any = [];
  data: go.GraphLinksModel;
  nodearr: node[] = [];
  linkarr: link[] = [];
  groupcode: any;
  mdc: string = "";
  view: string = "";
  increment: any = 0;
  myDiagramHeight: number;
  myDiagramWidth: number;
  public regel: string;
  public search: string;

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {

    this.nodeDataArray = NodeDataArray;
    this.linkDataArray = LinkDataArray
    this.nodeDataArray.forEach(element => {
      var nodeText = "";
      var cursorType = "default";
      if (element.text.length > 100) {
        nodeText = element.text.substring(0, 100) + "...";
      }
      else {
        nodeText = element.text;
      }
      if (element.text.trim().startsWith("-")) {
        nodeText = nodeText.trim().substr(1);
        nodeText = nodeText + ' ' + this.nodeIgnoreText;
      }
      if (element.leafnode == true) {
        var firstSpaceIndex = nodeText.indexOf(' ');
        var firstWord = nodeText.substring(0, firstSpaceIndex + 1) + '\n';
        var restWords = nodeText.substring(firstSpaceIndex + 1);
        nodeText = firstWord + restWords;
      }
      if (element.yellowbox == false) { cursorType = "pointer"; }
      let n = {
        key: element.key, text: nodeText, bounds: new go.Rect(element.xloc, element.yloc, 160, 100),
        color: element.color, fig: element.fig, width: element.width, height: element.height, groupCode: element.groupCode,
        regel: element.rownumber, tooltip: element.tooltip, yellowbox: element.yellowbox, leafnode: element.leafnode,
        rownumber: "Regel:" + element.rownumber, cursor: cursorType, groupCodeValue: element.text,
        loc: new go.Point(element.xloc, element.yloc), groupCodeText: element.groupCodeText
      };
      this.nodearr.push(n);
    });
    this.linkDataArray.forEach(element => {
      let l = { from: element.from, to: element.to, routing: go.Link.Orthogonal, fromSpot: element.fromSpot, toSpot: element.toSpot };
      this.linkarr.push(l);
    });

    this.data = new go.GraphLinksModel(this.nodearr, this.linkarr);

    if (this.mdc == "") {
      if (myDiagram != undefined) myDiagram.div = null;
      GoJsDraw(this.data);
    }
    else {
      if (myDiagram != undefined) myDiagram.div = null;
      GoJsDraw(this.data);
    }
  }

  showModalDialog() {
    var groupcode = document.getElementById("inputEventsMsg").textContent;
    var strData = document.getElementById("infoBoxHolder").textContent;

    alert(groupcode + ' ---- ' + strData);
  }

  render() {

    this.myDiagramHeight = window.innerHeight - 200;
    this.myDiagramWidth = window.innerWidth - 50;

    return (
      <div>

        <div style={{ marginTop: 50 }}>

          <div className="" style={{ display: 'block' }}>
            <h2 style={{ marginLeft: 500 }}>GoJS Viewer</h2>
            <div className="row mt-2 mb-3" style={{ display: 'block', marginLeft: 50, marginBottom: 30 }}>
              <div id="searchinput" style={{ display: 'block' }}>
                <table id="searchtable">
                  <tbody>

                    <tr>
                      <td>
                        <input type="text" id="mySearch" className="form-control mb-2" />
                      </td>
                      <td>

                        <button id="btnSearch" onClick={() => this.searchMyDiagram(this)} className="btn btn-primary mb-2">Search</button>

                      </td>
                      <td>
                        <div className="col-auto">
                          <div className="form-check mb-2">
                            <span id="searchresultCaption" style={{ display: 'none' }} className="form-check-label">Result: </span>
                            <label id="searchresult" style={{ display: 'none' }} className="form-check-label" > </label>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="col-auto ml-4">
                          <button id="btnview" style={{ display: 'none' }} type="button" className="btn btn-primary mb-2" data-toggle="modal"
                            data-target="#exampleModal">
                            Viewtable </button>
                        </div>
                      </td>
                      <td>
                        <div className="col-auto" id="arrows" style={{ display: 'none' }}>

                        </div>
                        <label id="counter" className="form-check-label"> </label>
                      </td>
                    </tr>

                  </tbody>

                </table>
              </div>
            </div>
            <button id="mdBtn" onClick={this.showModalDialog} style={{ display: "none" }}>Show dialog</button>

            <div id="myDiagramDiv" style={{ height: this.myDiagramHeight, width: this.myDiagramWidth, backgroundColor: 'white', position: 'relative', WebkitTapHighlightColor: 'rgba(255, 255, 255, 0)', cursor: 'auto' }} ></div>

            <div id="inputEventsMsg" style={{ display: "none" }}></div>
            <div id="infoBoxHolder" style={{ display: "none" }}></div>

            <div id="toolTipDIV" className="popover" data-toggle="popover" title="hi" data-content="gojs"></div>
          </div>
          <div id="myImages"></div>

        </div>
      </div>
    );
  }

  searchMyDiagram(elm) {
    elm.increment = 0;
    document.getElementById("counter").textContent = "";
    document.getElementById("counter").style.display = "none";
    searchDiagram(elm.regel);

    if (elm.increment > searchNodesArray.length) elm.increment = 1;
    var inc = ++elm.increment;
    if (inc > searchNodesArray.length) inc = 1;
    document.getElementById("counter").textContent = (inc).toString() + " of " + searchNodesArray.length.toString();
    if (inc == searchNodesArray.length) { searchDiagramExtended(searchNodesArray.length - 1) }
    else { searchDiagramExtended(inc - 1); }
    document.getElementById("counter").style.display = "inline";
  }
}

export interface node {
  key: string;
  text: string;
  color: string;
  bounds: go.Rect;
  fig: string;
  width: number;
  height: number;
  groupCode: string;
  regel: any;
  tooltip: any;
  leafnode: any;
  yellowbox: any;
  rownumber: any;
}

export interface link {
  from: string;
  to: string;
  routing: any;
  fromSpot: string;
  toSpot: string;

}

