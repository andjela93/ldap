import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService } from '../user-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {DataSource} from '@angular/cdk/table';


@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  baseDN: string = ""; // u zavisnosti ko je ulogovan!!
  scope: string = 'SUB';
  filterString: string = "";

  userForm = new FormGroup({
    value: new FormControl()
  });

  category =
    [
      { id: 1, name: "People" },
      { id: 2, name: "Group" }
    ];
    selectedValue = null;
  filter = [
    { id: 1, attribute: "uid" },
    { id: 2, attribute: "cn" },
    { id: 3, attribute: "sn" },
    { id: 4, attribute: "mail" }
  ];
  selectedAttribute = null;

  // za tabelu
  hiddenTable: boolean = true;

  displayedColumns = ['Ime i prezime', 'E-mail', 'Opcije'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // za tabelu
  
  constructor(private _userService: UserServiceService) { }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  onSubmit(){
    if(this.selectedValue !== null) {
      this.baseDN ="ou=" + this.selectedValue.name +","+ "o=domen1.rs,o=isp";
 
    }
    if(this.selectedAttribute !== null && this.userForm.value.value !== null) {
      this.filterString = "(" + this.selectedAttribute.attribute + "=" + this.userForm.value.value + ")";
    }

    this._userService.getUser(this.baseDN, this.scope, this.filterString)
    .subscribe(
      (data: any) => { 
      if (data !== null) { this.hiddenTable = false; } 

      var getData: ldapSearchData[] = [];
        for (let i = 0; i < data.ldapSearch.length; i++) {
          const element = data.ldapSearch[i];
          getData.push(mapJsonUser(data.ldapSearch[i]))
          
        }

      this.dataSource = new MatTableDataSource(getData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
   
  }



}

function mapJsonUser(obj: any):ldapSearchData
{
  return {
    dn: obj.dn,
    objectClass: obj.objectClass,
    uid: obj.uid,
    cn: obj.cn,
    sn:obj.cn,
    mail: obj.mail,
    inetUserStatus: obj.inetUserStatus
  }
}

export interface ldapSearchData {
    dn: string;
    objectClass: Array<string>;
    uid: string;
    cn: string;
    sn:string;
    mail: string;
    inetUserStatus: string;
}
