import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, EventEmitter } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdDatepicker, MdSelectionList, MdSelectionListOptionEvent } from '@angular/material';
import { ANADate, ANATime, AddressInput, GeoLoc, ListItem } from '../../models/ana-chat.models';
import * as agm from '@agm/core';

@Component({
    selector: 'app-complex-input',
    templateUrl: './complex-input.component.html',
    styleUrls: ['./complex-input.component.css']
})
export class ComplexInputComponent implements OnInit, AfterViewInit {
    constructor(
        public dialogRef: MdDialogRef<ComplexInputComponent>,
        @Inject(MD_DIALOG_DATA) public params: ComplexInputParams) { }

    ngOnInit() {
        if (this.params.Type == ComplexType.Location) {
            if (this.params.DefaultGeoLoc)
                this.geoLoc = this.params.DefaultGeoLoc;
        } else if (this.params.Type == ComplexType.List) {
            this.listValues = this.params.ListValues;
            this.listMultiple = this.params.ListMultiple;
        }
    }

    ngAfterViewInit(): void {
        Promise.resolve(null).then(() => {
            if (this.params.Type == ComplexType.Date)
                this.datePicker.open();
        });
    }

    ComplexType = ComplexType;

    choosenTime: string;
    getChoosenANATime(): ANATime {
        let split = this.choosenTime.split(':');
        return {
            hour: split[0],
            minute: split[1],
            second: "0"
        };
    }

    @ViewChild("datePicker")
    datePicker: MdDatepicker<Date>;

    choosenDate: Date;
    getChoosenANADate(): ANADate {
        return {
            mday: this.choosenDate.getDate().toString(),
            month: (this.choosenDate.getMonth() + 1).toString(),
            year: this.choosenDate.getFullYear().toString()
        };
    }

    givenAddress: AddressInput = {
        area: "",
        city: "",
        country: "",
        line1: "",
        pin: "",
        state: ""
    };

    geoLoc: GeoLoc = {
        lat: 0.0,
        lng: 0.0
    };

    mapLocationUpdated(event: agm.MouseEvent) {
        this.geoLoc.lat = event.coords.lat;
        this.geoLoc.lng = event.coords.lng;
    }

    selectedListItem: ListItem;
    listValues: ListItem[];
    listMultiple: boolean;
    choosenListValues() {
        if (this.listMultiple)
            return this.listValues.filter(x => x.isSelected);
        else
            return [this.selectedListItem];
    }

    isValid(): boolean {
        switch (this.params.Type) {
            case ComplexType.Address:
                {
                    if (this.givenAddress &&
                        this.givenAddress.area &&
                        this.givenAddress.city &&
                        this.givenAddress.country &&
                        this.givenAddress.line1 &&
                        this.givenAddress.pin &&
                        this.givenAddress.state) {
                        return true;
                    }
                    else
                        return false;
                }
            case ComplexType.Date:
                {
                    if (this.choosenDate)
                        return true;
                    else
                        return false;
                }
            case ComplexType.Time:
                {
                    if (this.choosenTime)
                        return true;
                    else
                        return false;
                }
            case ComplexType.List:
                {
                    if (this.listMultiple) {
                        if (this.choosenListValues() && this.choosenListValues().length > 0)
                            return true;
                        else
                            return false;
                    } else {
                        return this.selectedListItem != null;
                    }
                }
            case ComplexType.Location:
                {
                    if (this.geoLoc)
                        return true;
                    else
                        return false;
                }
            default:
                return true;
        }
    }

    dialogClose() {
        this.dialogRef.close(true);
    }
}

export enum ComplexType {
    Date, Time, Location, Address, List
}

export interface ComplexInputParams {
    Type: ComplexType;
    DefaultGeoLoc: GeoLoc;
    ListValues: ListItem[];
    ListMultiple: boolean;
}