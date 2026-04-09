import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  isMaster?: boolean;
}

export interface FlatTreeNode {
  id: string;
  label: string;
  level: number;
  expandable: boolean;
  isMaster?: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  values: DimensionValue[];
}

export interface DimensionValue {
  id: string;
  name: string;
  dimensionId: string;
}

@Component({
  selector: 'app-tree-builder',
  templateUrl: './tree-builder.component.html',
  styleUrls: ['./tree-builder.component.scss']
})
export class TreeBuilderComponent implements OnInit {
  form: FormGroup;
  
  // Mock dimensions data
  dimensions: Dimension[] = [
    {
      id: '1',
      name: 'Avdeling',
      values: [
        { id: '1', name: 'Root', dimensionId: '1' },
        { id: '2', name: 'Ølesund', dimensionId: '1' },
        { id: '3', name: 'Oslo', dimensionId: '1' },
        { id: '4', name: 'Ølesund / Arnfinn', dimensionId: '1' },
        { id: '5', name: 'Product Development', dimensionId: '1' },
        { id: '6', name: 'Administration', dimensionId: '1' },
        { id: '7', name: 'Sales', dimensionId: '1' },
        { id: '8', name: 'Marketing', dimensionId: '1' },
        { id: '9', name: 'Finance', dimensionId: '1' },
        { id: '10', name: 'IT', dimensionId: '1' },
        { id: '11', name: 'Human Resources', dimensionId: '1' },
        { id: '12', name: 'Operations', dimensionId: '1' },
        { id: '13', name: 'Research & Development', dimensionId: '1' },
        { id: '14', name: 'Customer Support', dimensionId: '1' },
        { id: '15', name: 'Legal', dimensionId: '1' }
      ]
    },
    {
      id: '2',
      name: 'Prosjekt',
      values: [
        { id: '16', name: 'Project Alpha', dimensionId: '2' },
        { id: '17', name: 'Project Beta', dimensionId: '2' },
        { id: '18', name: 'Project Gamma', dimensionId: '2' },
        { id: '19', name: 'Digital Transformation', dimensionId: '2' },
        { id: '20', name: 'Market Expansion', dimensionId: '2' },
        { id: '21', name: 'Product Launch', dimensionId: '2' },
        { id: '22', name: 'System Integration', dimensionId: '2' },
        { id: '23', name: 'Process Optimization', dimensionId: '2' }
      ]
    },
    {
      id: '3',
      name: 'Firma',
      values: [
        { id: '24', name: 'Shiba Group AS', dimensionId: '3' },
        { id: '25', name: 'Shiba Norway AS', dimensionId: '3' },
        { id: '26', name: 'Shiba Sweden AB', dimensionId: '3' },
        { id: '27', name: 'Shiba Denmark A/S', dimensionId: '3' },
        { id: '28', name: 'Shiba Finland Oy', dimensionId: '3' }
      ]
    },
    {
      id: '4',
      name: 'Spesifikasjon',
      values: [
        { id: '29', name: 'High Priority', dimensionId: '4' },
        { id: '30', name: 'Medium Priority', dimensionId: '4' },
        { id: '31', name: 'Low Priority', dimensionId: '4' },
        { id: '32', name: 'Critical', dimensionId: '4' },
        { id: '33', name: 'Standard', dimensionId: '4' },
        { id: '34', name: 'Custom', dimensionId: '4' },
        { id: '35', name: 'Internal', dimensionId: '4' },
        { id: '36', name: 'External', dimensionId: '4' },
        { id: '37', name: 'Confidential', dimensionId: '4' },
        { id: '38', name: 'Public', dimensionId: '4' },
        { id: '39', name: 'Development', dimensionId: '4' },
        { id: '40', name: 'Production', dimensionId: '4' },
        { id: '41', name: 'Testing', dimensionId: '4' },
        { id: '42', name: 'Archived', dimensionId: '4' },
        { id: '43', name: 'Active', dimensionId: '4' }
      ]
    },
    {
      id: '5',
      name: 'Kunde/lev',
      values: [
        { id: '44', name: 'Enterprise A', dimensionId: '5' },
        { id: '45', name: 'Enterprise B', dimensionId: '5' },
        { id: '46', name: 'SMB Corp', dimensionId: '5' },
        { id: '47', name: 'Startup Inc', dimensionId: '5' },
        { id: '48', name: 'Government Agency', dimensionId: '5' },
        { id: '49', name: 'Healthcare Provider', dimensionId: '5' },
        { id: '50', name: 'Educational Institution', dimensionId: '5' },
        { id: '51', name: 'Financial Services', dimensionId: '5' },
        { id: '52', name: 'Retail Chain', dimensionId: '5' },
        { id: '53', name: 'Manufacturing Co', dimensionId: '5' },
        { id: '54', name: 'Technology Partner', dimensionId: '5' },
        { id: '55', name: 'Consulting Firm', dimensionId: '5' },
        { id: '56', name: 'Non-Profit Org', dimensionId: '5' },
        { id: '57', name: 'Media Company', dimensionId: '5' },
        { id: '58', name: 'Transportation Co', dimensionId: '5' },
        { id: '59', name: 'Energy Provider', dimensionId: '5' },
        { id: '60', name: 'Telecom Operator', dimensionId: '5' },
        { id: '61', name: 'Insurance Company', dimensionId: '5' },
        { id: '62', name: 'Real Estate Firm', dimensionId: '5' },
        { id: '63', name: 'Legal Services', dimensionId: '5' },
        { id: '64', name: 'Accounting Firm', dimensionId: '5' },
        { id: '65', name: 'Marketing Agency', dimensionId: '5' },
        { id: '66', name: 'Research Institute', dimensionId: '5' }
      ]
    },
    {
      id: '6',
      name: 'Motparter',
      values: [
        { id: '67', name: 'Supplier A', dimensionId: '6' },
        { id: '68', name: 'Supplier B', dimensionId: '6' },
        { id: '69', name: 'Vendor C', dimensionId: '6' },
        { id: '70', name: 'Partner D', dimensionId: '6' },
        { id: '71', name: 'Contractor E', dimensionId: '6' },
        { id: '72', name: 'Service Provider F', dimensionId: '6' },
        { id: '73', name: 'Consultant G', dimensionId: '6' }
      ]
    },
    {
      id: '7',
      name: 'Lønntakere',
      values: [
        { id: '74', name: 'John Doe', dimensionId: '7' },
        { id: '75', name: 'Jane Smith', dimensionId: '7' },
        { id: '76', name: 'Ole Hansen', dimensionId: '7' },
        { id: '77', name: 'Kari Johansen', dimensionId: '7' },
        { id: '78', name: 'Per Andersen', dimensionId: '7' },
        { id: '79', name: 'Anne Berg', dimensionId: '7' },
        { id: '80', name: 'Erik Larsen', dimensionId: '7' },
        { id: '81', name: 'Maria Olsen', dimensionId: '7' },
        { id: '82', name: 'Lars Pedersen', dimensionId: '7' },
        { id: '83', name: 'Inger Nilsen', dimensionId: '7' },
        { id: '84', name: 'Bjørn Kristiansen', dimensionId: '7' },
        { id: '85', name: 'Hilde Solberg', dimensionId: '7' },
        { id: '86', name: 'Anders Jensen', dimensionId: '7' },
        { id: '87', name: 'Sofie Rasmussen', dimensionId: '7' },
        { id: '88', name: 'Morten Eriksen', dimensionId: '7' },
        { id: '89', name: 'Line Svendsen', dimensionId: '7' },
        { id: '90', name: 'Thomas Amundsen', dimensionId: '7' },
        { id: '91', name: 'Camilla Bakke', dimensionId: '7' },
        { id: '92', name: 'Henrik Dahl', dimensionId: '7' },
        { id: '93', name: 'Nina Evensen', dimensionId: '7' },
        { id: '94', name: 'Stein Foss', dimensionId: '7' },
        { id: '95', name: 'Marianne Gundersen', dimensionId: '7' },
        { id: '96', name: 'Roar Haugen', dimensionId: '7' },
        { id: '97', name: 'Lise Iversen', dimensionId: '7' },
        { id: '98', name: 'Knut Jørgensen', dimensionId: '7' },
        { id: '99', name: 'Elise Karlsen', dimensionId: '7' },
        { id: '100', name: 'Arne Lindberg', dimensionId: '7' },
        { id: '101', name: 'Tone Madsen', dimensionId: '7' },
        { id: '102', name: 'Geir Nordby', dimensionId: '7' },
        { id: '103', name: 'Randi Ødegård', dimensionId: '7' },
        { id: '104', name: 'Svein Paulsen', dimensionId: '7' },
        { id: '105', name: 'Bente Qvist', dimensionId: '7' },
        { id: '106', name: 'Dag Rønning', dimensionId: '7' },
        { id: '107', name: 'Helene Sandvik', dimensionId: '7' },
        { id: '108', name: 'Odd Torgersen', dimensionId: '7' },
        { id: '109', name: 'Vibeke Ulriksen', dimensionId: '7' },
        { id: '110', name: 'Willy Vangen', dimensionId: '7' },
        { id: '111', name: 'Yngve Wold', dimensionId: '7' },
        { id: '112', name: 'Zara Åsnes', dimensionId: '7' },
        { id: '113', name: 'Åge Berg', dimensionId: '7' },
        { id: '114', name: 'Øystein Carlsen', dimensionId: '7' },
        { id: '115', name: 'Æsa Danielsen', dimensionId: '7' },
        { id: '116', name: 'Øyvind Eriksen', dimensionId: '7' },
        { id: '117', name: 'Åshild Fredriksen', dimensionId: '7' },
        { id: '118', name: 'Geir Gunnarsson', dimensionId: '7' },
        { id: '119', name: 'Hilde Henriksen', dimensionId: '7' },
        { id: '120', name: 'Ivar Isaksen', dimensionId: '7' },
        { id: '121', name: 'Jorunn Jacobsen', dimensionId: '7' },
        { id: '122', name: 'Kjell Knutsen', dimensionId: '7' },
        { id: '123', name: 'Laila Lien', dimensionId: '7' },
        { id: '124', name: 'Mads Monsen', dimensionId: '7' },
        { id: '125', name: 'Nora Nygaard', dimensionId: '7' },
        { id: '126', name: 'Olav Olsen', dimensionId: '7' },
        { id: '127', name: 'Petra Pedersen', dimensionId: '7' },
        { id: '128', name: 'Quentin Qvale', dimensionId: '7' },
        { id: '129', name: 'Ragnhild Røed', dimensionId: '7' },
        { id: '130', name: 'Sigurd Sæther', dimensionId: '7' },
        { id: '131', name: 'Tove Thorsen', dimensionId: '7' },
        { id: '132', name: 'Ulf Ulvestad', dimensionId: '7' },
        { id: '133', name: 'Vera Viken', dimensionId: '7' },
        { id: '134', name: 'Wenche Wang', dimensionId: '7' },
        { id: '135', name: 'Xavier Xander', dimensionId: '7' },
        { id: '136', name: 'Ylva Yngve', dimensionId: '7' },
        { id: '137', name: 'Zander Zachariassen', dimensionId: '7' },
        { id: '138', name: 'Åge Åkervik', dimensionId: '7' },
        { id: '139', name: 'Øystein Ødegård', dimensionId: '7' },
        { id: '140', name: 'Æsa Ægir', dimensionId: '7' }
      ]
    }
  ];

  selectedDimension: Dimension | null = null;
  trees: TreeNode[] = [];
  selectedTreeIndex: number = 0;

  private _transformer = (node: TreeNode, level: number): FlatTreeNode => {
    return {
      id: node.id,
      label: node.label,
      level: level,
      expandable: !!node.children && node.children.length > 0,
      isMaster: node.isMaster
    };
  };

  treeControl = new FlatTreeControl<FlatTreeNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.form = this.fb.group({
      // Form controls if needed
    });

    // Initialize with master tree
    this.trees = [
      {
        id: 'master',
        label: 'Shiba Group AS',
        children: [],
        isMaster: true
      }
    ];
    
    this.updateDataSource();
  }

  ngOnInit(): void {
    // Initialize component
  }

  onDimensionSelect(dimension: Dimension): void {
    this.selectedDimension = dimension;
  }

  onValueEdit(value: DimensionValue): void {
    // Handle edit action
    console.log('Edit value:', value);
  }

  onValueDelete(value: DimensionValue): void {
    // Handle delete action
    console.log('Delete value:', value);
    if (this.selectedDimension) {
      this.selectedDimension.values = this.selectedDimension.values.filter(v => v.id !== value.id);
    }
  }

  onCreateTree(): void {
    const newTree: TreeNode = {
      id: `tree-${Date.now()}`,
      label: `Tree ${this.trees.length}`,
      children: []
    };
    this.trees.push(newTree);
    this.selectedTreeIndex = this.trees.length - 1;
    this.updateDataSource();
  }

  onDeleteTree(index: number): void {
    if (index > 0) { // Don't delete master tree
      this.trees.splice(index, 1);
      if (this.selectedTreeIndex >= this.trees.length) {
        this.selectedTreeIndex = this.trees.length - 1;
      }
      this.updateDataSource();
    }
  }

  onTreeSelect(index: number): void {
    this.selectedTreeIndex = index;
    this.updateDataSource();
  }

  onDrop(event: CdkDragDrop<DimensionValue[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onTreeDrop(event: CdkDragDrop<TreeNode[]>): void {
    const droppedValue = event.item.data as DimensionValue;
    const targetTree = this.trees[this.selectedTreeIndex];
    
    if (targetTree) {
      const newNode: TreeNode = {
        id: `node-${Date.now()}`,
        label: droppedValue.name,
        children: []
      };
      
      if (!targetTree.children) {
        targetTree.children = [];
      }
      
      targetTree.children.push(newNode);
      this.updateDataSource();
    }
  }

  onNodeDelete(nodeId: string): void {
    this.deleteNodeFromTree(this.trees[this.selectedTreeIndex], nodeId);
    this.updateDataSource();
  }

  private deleteNodeFromTree(tree: TreeNode, nodeId: string): boolean {
    if (tree.children) {
      const index = tree.children.findIndex(child => child.id === nodeId);
      if (index !== -1) {
        tree.children.splice(index, 1);
        return true;
      }
      
      for (const child of tree.children) {
        if (this.deleteNodeFromTree(child, nodeId)) {
          return true;
        }
      }
    }
    return false;
  }

  private updateDataSource(): void {
    if (this.trees.length > 0 && this.selectedTreeIndex < this.trees.length) {
      this.dataSource.data = [this.trees[this.selectedTreeIndex]];
    }
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;
} 