import { inject } from 'aurelia-framework';
import { Service } from "./../service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {
    context = ["Detail"];
    columns = [
        { field: "name", title: "Diskon" },
        { field: "startDate", title: "Mulai Berlaku", formatter: function (value, data, index) {
            return moment(value).format("DD MMM YYYY");
          }
        },
        { field: "endDate", title: "Berlaku Hingga", formatter: function (value, data, index) {
            return moment(value).format("DD MMM YYYY");
          } 
        },
        { field: "discountMapping", title: "Mapping Diskon" },
    ];

    loader = (info) => {
        var order = {};

        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                for (let data of result.data) {
                    data.name = data.name ? data.name + "%" : data.name;
                }
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: data._id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}