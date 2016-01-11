const sample = [{
    text: `item-1`,
    nodes: [{
        text: `item-2`,
        type: 'section',
        nodes: [{
            text: 'item-4'
        }]
    },
        {
            text: `item-3`,
            type: 'staff',
            isLeaf: true
        }]
}]
const Tester = () => {
    var fakename = 0;
    $.mockjax({
        url: '/getTree',
        responseTime: 1000,
        response(settings) {
            this.responseText = {
                rootId: settings.data.id,
                nodes: [
                    {
                        text: `item-${++fakename}`,
                        type: 'section'
                    },
                    {
                        text: `item-${++fakename}`,
                        type: 'staff',
                        isLeaf: true
                    }
                ]
            }
        }
    });
}

$(() => {
    Tester();
    let vtree = $('.tree-box').vtree({
        lazyLoad: true,
        xhrConf: {
            type: 'GET',
            url: '/getTree',
            dataType: 'json'
        },
        loadingImg: 'assets/static/loading.gif',
        types: {
            section: {
                icon: 'glyphicon glyphicon-home',
                action: {
                    defaultName: '隐藏人员',
                    activeName: '显示人员',
                    event: function($elem, state) {
                        let $collect = $elem.children('ul').children('li[data-type!="section"]');
                        if (state === this.defaultName) {
                            $collect.hide();
                        } else {
                            $collect.show();
                        }
                    }
                }
            },
            staff: {
                icon: 'glyphicon glyphicon-user'
            }
        }
    });
}
)
