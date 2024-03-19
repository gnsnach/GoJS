import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DiagramComponent, PaletteComponent } from 'gojs-angular';
interface linePalette {
  name: string;
  nodes: any[];
}
const $ = go.GraphObject.make;
@Component({
  selector: 'app-radio-plan',
  templateUrl: './radio-plan.component.html',
  styleUrls: ['./radio-plan.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RadioPlanComponent implements OnInit {
  @ViewChild("radioPlan", { static: true })
  public radioPlanComponent!: DiagramComponent;
  @ViewChild("line", { static: true })
  public lineComponent!: PaletteComponent;
  public diagramDivClassName = "myRadioPlanDiv";
  public paletteDivClassName = "myLineDiv";

  public loc = [
    { "lineNo": "121", "radioName": "Radio21" },
    { "lineNo": "136", "radioName": "Radio21" },
    { "lineNo": "138", "radioName": "Radio21" },
    { "lineNo": "122", "radioName": "A.Radio1" },
    { "lineNo": "137", "radioName": "A.Radio1" },
    { "lineNo": "139", "radioName": "A.Radio1" },
    { "lineNo": "132", "radioName": "SDR1" },
    { "lineNo": "152", "radioName": "SDR1" },
    { "lineNo": "128", "radioName": "Radio3" },
    { "lineNo": "148", "radioName": "Radio3" },
    { "lineNo": "149", "radioName": "Radio3" },
  ];

  addID = (n: any[]) => {
    let i = 1;
    return n.map((r: any) => ({ "id": i++, ...r }));
  };
  public lineDataArray: any = this.addID(this.loc);
  public diagramNodeData = [];
  public selectedNodeData = null;
  public presNamesList: Set<[String]> = new Set(this.lineDataArray.map((i: { radioName: any; }) => i.radioName));
  public presRadioArray: any = [];
  public filteredData: any = [];
  public selectedRadioId: any;

  public state = {
    lineModelData: { prop: "val" },
    radioPlanModelData: { prop: "value" },
    skipsDiagramUpdate: false
  };

  constructor(private cdr: ChangeDetectorRef) { };
  ngOnInit(): void { };
  public lineDiagramPalettes: linePalette[] = Array.from(this.presNamesList).map(radioName => {
    const filteredNodes = this.lineDataArray.filter((node: { radioName: [String]; }) => node.radioName === radioName)
    // this.filteredData = filteredNodes;
    this.presRadioArray.push({
      name: `${radioName}`,
      nodes: filteredNodes,
    });
    return this.presRadioArray;
  });
  public radioPlanDiagram: any = null;
  public lineDiagram: any = null;
  public ngAfterViewInit() {

    // if (this.radioPlanDiagram) return;
    // console.log(this.radioPlanDiagram)
    // console.log(this.radioPlanComponent)
    // this.radioPlanDiagram = this.radioPlanComponent.diagram;
    // this.cdr.detectChanges();

    // if (this.lineDiagram) return;
    // console.log(this.lineDiagram)
    // console.log(this.lineComponent)
    this.lineDiagramPalettes.forEach((e: any) => {
      console.log(e)
    })

    if (this.radioPlanComponent) {
      this.radioPlanDiagram = this.radioPlanComponent.diagram;
      console.log(this.radioPlanDiagram)
      console.log(this.radioPlanComponent)
    }

    if (this.lineComponent) {
      this.lineDiagram = this.lineComponent.palette
      console.log(this.lineDiagram)
      console.log(this.lineComponent)
    }
    const radioplanComp: RadioPlanComponent = this;
  };
  public initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    let dia = $(go.Diagram, { //"radioPlan",
      "undoManager.isEnabled": false,
      "animationManager.isEnabled": true,
      "allowDragOut": false,
      "allowMove": false,
      "allowDrop": false,
      "allowVerticalScroll": false,
      "allowHorizontalScroll": false,
      // "allowDelete": false,
      "allowCopy": false,
      "allowClipboard": false,
      "allowGroup": false,
      "allowInsert": false,

      model: new go.GraphLinksModel(
        {
          nodeKeyProperty: 'key',
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      ),
      layout: $(go.GridLayout,
        {
          spacing: new go.Size(40, 40),  // Adjust spacing as needed
          wrappingColumn: Infinity,
        }),
      contentAlignment: go.Spot.TopLeft, // Align the entire diagram content to the top left
    });
    dia.commandHandler.archetypeGroupData = { key: "Group", isGroup: true };
    dia.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        resizable: false,
        resizeObjectName: "SHAPE",
      },
      new go.Binding("text", "lineNo"), //for sorting         
      $(go.Shape, 'RoundedRectangle',
        {
          name: 'SHAPE', fill: 'lightgray', stroke: 'black',
        },
      ),
      $(go.Panel, 'Horizontal',
        $(go.Panel, 'Table',
          {
            maxSize: new go.Size(850, 999),
            margin: new go.Margin(5),
            defaultAlignment: go.Spot.Left
          },

          $(go.RowColumnDefinition, { column: 4, width: 8 }),

          $(go.TextBlock, 'LineNo: ', { font: '12pt  Segoe UI,sans-serif', stroke: 'darkgreen' },
            {
              row: 0, column: 0,
              editable: false, isMultiline: false,
              minSize: new go.Size(10, 16)
            }),
          $(go.TextBlock, { font: '12pt  Segoe UI,sans-serif', stroke: 'darkgreen' },
            {
              row: 0, column: 1, columnSpan: 5,
              editable: false, isMultiline: false,
              minSize: new go.Size(10, 16),
              margin: new go.Margin(2, 2, 2, 2)
            },
            new go.Binding('text', 'lineNo').makeTwoWay()), //LINE No

          $(go.TextBlock, 'Name: ', { font: '9pt  Segoe UI,sans-serif', stroke: 'red' },
            {
              row: 1, column: 0,
              font: '12pt Segoe UI,sans-serif',
              editable: false, isMultiline: false,
              minSize: new go.Size(10, 16)
            }),

          $(go.TextBlock, { font: '9pt  Segoe UI,sans-serif', stroke: 'red' },
            {
              row: 1, column: 1, columnSpan: 5,
              font: '12pt Segoe UI,sans-serif',
              editable: true, isMultiline: false,
              minSize: new go.Size(10, 16),
              margin: new go.Margin(2, 2, 2, 2)
            },
            new go.Binding('text', 'radioName').makeTwoWay()),//RADIO NAME
        ),
        {
          toolTip: $(
            "ToolTip",
            { "Border.stroke": "#5b5b5b", "Border.strokeWidth": 2 },
            $(
              go.TextBlock,
              { margin: 8, stroke: "#5b5b5b", font: "bold 16px sans-serif" },

              // new go.Binding("text", "lineNo"),
              new go.Binding("text", "radioName"),
            )
          ),
        }
      )

    ); //END of NODE Template   
    return dia;
  };
  public initPalette(): go.Palette {
    const $ = go.GraphObject.make;
    let pal = $(go.Palette,
      {
        layout: $(go.GridLayout,
          {
            spacing: new go.Size(25, 25),  // Adjust spacing as needed
            wrappingColumn: 460,
            wrappingWidth: 500,
          }),
        contentAlignment: go.Spot.TopCenter, // Align the entire diagram content to the top left          
      });
    // define the Node template
    pal.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        resizable: false,
        resizeObjectName: "SHAPE",
      },
      new go.Binding("text", "lineNo"), //for sorting   
      $(go.Shape, 'RoundedRectangle',
        {
          name: 'SHAPE', width: 150, height: 70, margin: 4, fill: null, strokeWidth: 2, stroke: 'coral',
        },
      ),
      // $(go.Panel, 'Horizontal',
      $(go.Panel, 'Table',
        {
          maxSize: new go.Size(850, 999),
          margin: new go.Margin(5),
          defaultAlignment: go.Spot.Left
        },

        $(go.RowColumnDefinition, { column: 4, width: 8 }),

        // $(go.TextBlock, 'LineNo: ', { font: '12pt  Segoe UI,sans-serif', stroke: 'white' },
        //   {
        //     row: 0, column: 0,
        //     editable: false, isMultiline: false,
        //     minSize: new go.Size(10, 16)
        //   }),
        $(go.TextBlock, { font: '12pt  Segoe UI,sans-serif', stroke: 'white' },
          {
            row: 0, column: 1, columnSpan: 5,
            editable: false, isMultiline: false,
            minSize: new go.Size(10, 16),
            margin: new go.Margin(2, 2, 2, 2)
          },
          new go.Binding('text', 'lineNo')), //LINE No

        // $(go.TextBlock, 'Name: ', { font: '9pt  Segoe UI,sans-serif', stroke: 'white' },
        //   {
        //     row: 1, column: 0,
        //     font: '12pt Segoe UI,sans-serif',
        //     editable: false, isMultiline: false,
        //     minSize: new go.Size(10, 16)
        //   }),

        $(go.TextBlock, { font: '12pt  Segoe UI,sans-serif', stroke: 'white' },
          {
            row: 1, column: 1, columnSpan: 5,
            editable: true, isMultiline: false,
            minSize: new go.Size(10, 16),
            margin: new go.Margin(2, 2, 2, 2)
          },
          new go.Binding('text', 'radioName')),//RADIO NAME
      ),
      {
        toolTip: $(
          "ToolTip",
          { "Border.stroke": "#5b5b5b", "Border.strokeWidth": 2 },
          $(
            go.TextBlock,
            { margin: 8, stroke: "#5b5b5b", font: "bold 16px sans-serif" },

            // new go.Binding("text", "lineNo"),
            new go.Binding("text", "radioName"),
          )
        ),
      }
      // )
    ); //END of palette NODE Template
    // ===============================================================================================
    pal.model = new go.GraphLinksModel,
    {
      linkKeyProperty: 'key'  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    };
    return pal;
  };
}
