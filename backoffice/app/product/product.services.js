let ProductServices = angular.module("aq.product.services", ["ngResource"]);

ProductServices.factory("Product", [
    "$resource", function ($resource) {
        return $resource("products/:module/:code", {}, {
            query         : {method: "GET", params: {code: ""}, isArray: true},
            create        : {method: "POST", params: {}},
            getById       : {method: "POST", params: {action: "i"}},
            getVariation  : {method: "GET", params: {module: "variation"}, isArray: true},
            getAssociated : {method: "GET", params: {module: "associated"}, isArray: true},
            count         : {method: "GET", params: {module: "count"}, isArray: false},
            remove        : {method: "DELETE", params: {module: null}}
        });
    }
]);

ProductServices.factory("ProductsV2", [
    "$resource", function ($resource) {
        return $resource("v2/:type/:id", {}, {
            list         : {method: "POST", params: {type: "products"}},
            query        : {method: "POST", params: {type: "product"}},
            save       : {method: "PUT", params: {type: "product"}},
            delete  : {method: "DELETE", params: {type: "product"}},
            searchObj  : {method: "POST", params: {type: "products", id: 'searchObj'}},
            getPromos: {method: "POST", params: {type: 'product', id: 'promos'}, isArray: false},
            getDownloadHistory: {method: "POST", params: {type: 'downloadHistory'}, isArray: false},
            preview: {method: "POST", params: {type: 'product', id: 'preview'}, isArray: false},
        });
    }
]);

ProductServices.factory("Products", [
    "$resource", function ($resource) {
        return $resource("v2/products/:action/:id", {}, {
            list     : {method: "POST", params: {}},
            category : {method: "POST", params: {action: "category", id: ""}}
        });
    }
]);

/*ProductServices.factory("ProductScroll", [
    "$resource", function ($resource) {
        return $resource("products/partial/:start/:limit", {}, {
            query : {method: "GET", params: {start: "", limit: ""}, isArray: true}
        });
    }
]);*/

ProductServices.factory("ProductSearch", [
    "$resource", function ($resource) {
        return $resource("products/searchadmin", {}, {
            query : {method: "POST", params: {}, isArray: true}
        });
    }
]);

ProductServices.factory("ProductPagination", [
    "$resource", function ($resource) {
        return $resource("products/pagination/:page/:limit", {}, {
            query  : {method: "GET", params: {}}, search : {method: "POST", params: {}}
        });
    }
]);

ProductServices.factory("ProductTri", [
    "$resource", function ($resource) {
        return $resource("/products/trier", {}, {
            search : {method: "POST", params: {}, isArray: true}
        });
    }
]);

ProductServices.factory("ProductImage", [
    "$resource", function ($resource) {
        return $resource("/products/image/:type/:id", {}, {
            query : {method: "GET"}
        });
    }
]);

ProductServices.factory("ProductService", [
    "Product", function (Product) {
        const self = this;

        self.getProductObject = function () {
            return {
                active   : false, _visible : false, images   : [], autoSlug : true
            };
        };

        self.saveProduct = function (product) {
            return Product.save(product).$promise;
        };

        return self;
    }
]);

ProductServices.service("ProductColumns", function () {
    return [
        {
            filter : {
                component_template :  "<span translate>product.list2.picture</span>"
            },
            inter : {component_template: ""},
            cell  : {component_template: "<img ng-src='/{{getImage(product.images)}}' class='no-product-image' style='width:120px;height:90px' />"}
        },
        {
            filter : {
                component_template : "<a ng-click=\"local.sortType = 'translation.' + defaultLang + '.name'; local.sortReverse = !local.sortReverse; getProducts();\">"
                    + "<span translate>product.list2.name</span>"
                    + "<span ng-show=\"local.sortType == 'translation.' + defaultLang + '.name' && !local.sortReverse\" class=\"ico-chevron-down\"></span>"
                    + "<span ng-show=\"local.sortType == 'translation.' + defaultLang + '.name' && local.sortReverse\" class=\"ico-chevron-up\"></span>"
                    + "</a>"
            },
            inter : {component_template: "<input ng-model='searchObj.translation.name' ng-change='getProducts(1)' ng-model-options='{debounce: 500}' translate translate-attr='{placeholder: \"product.list2.name\"}' class='form-control' type='text'>"},
            cell  : {component_template: "{{product.translation[defaultLang].name}}"}
        },
        {
            filter : {
                component_template : "<a ng-click=\"local.sortType = 'price.ati.normal'; local.sortReverse = !local.sortReverse; getProducts();\">"
                    + "<span translate>product.list2.price</span>"
                    + "<span ng-show=\"local.sortType == 'price.ati.normal' && !local.sortReverse\" class=\"ico-chevron-down\"></span>"
                    + "<span ng-show=\"local.sortType == 'price.ati.normal' && local.sortReverse\" class=\"ico-chevron-up\"></span>"
                    + "</a>"
            },
            inter : {component_template: "<div style='width:125px;margin:auto'><input translate translate-attr='{placeholder: \"product.list2.min\"}' ng-model='searchObj.priceSaleMin' class='form-control' ng-change='getProducts()' type='number' style='width: 60px;' /> <input translate translate-attr='{placeholder: \"product.list2.max\"}' ng-model='searchObj.priceSaleMax' class='form-control' ng-change='getProducts()' type='number' style='width: 60px;' /></div>"},
            cell  : {class: "text-right", component_template: "{{product.price.ati.normal !== undefined && product.price.ati.normal != null ? product.price.ati.normal + ' €' : 'N/A'}}"}
        },
        {
            filter : {
                component_template : "<a ng-click=\"local.sortType = 'stock.qty'; local.sortReverse = !local.sortReverse; getProducts();\">"
                    + "<span translate>product.list2.quantity</span>"
                    + "<span ng-show=\"local.sortType == 'stock.qty' && !local.sortReverse\" class=\"ico-chevron-down\"></span>"
                    + "<span ng-show=\"local.sortType == 'stock.qty' && local.sortReverse\" class=\"ico-chevron-up\"></span>"
                    + "</a>"
            },
            inter : {component_template: "<div style='width:125px;margin:auto'><input translate translate-attr='{placeholder: \"product.list2.min\"}' ng-model='searchObj.qtyMin' class='form-control' ng-change='getProducts()' type='number' style='width: 60px;' /> <input translate translate-attr='{placeholder: \"product.list2.max\"}' ng-model='searchObj.qtyMax' class='form-control' ng-change='getProducts()' type='number' style='width: 60px;' /></div>"},
            cell  : {class: "text-right", component_template: "{{product.stock.qty !== undefined && product.stock.qty != null ? product.stock.qty : 'N/A'}}"}
        }
    ];
});
