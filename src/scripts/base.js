var fakename = 0;

const Tester = () => {
    $.mockjax({
        url: '/getTree',
        responseTime: 1000,
        response(settings) {
            this.responseText = {
                rootId: settings.data.id,
                nodes: [
                    {
                        text: `item-${++fakename}`,
                        type: 'staff',
                        isLeaf: true
                    },
                    {
                        text: `item-${++fakename}`,
                        type: 'section'
                    }
                ]
            }
        }
    });
}
var Samples = {
    rootId: 0, //默认0
    nodes: [
        {
            text: `item-${++fakename}`,
            type: 'section',
            url: 'www.baidu.com',
            isExpanded: true,
            nodes: [
                {
                    url: 'http://www.baidu.com',
                    text: `item-${++fakename}`,
                    type: 'section'
                },
                {
                    url: 'http://www.baidu.com',
                    text: `item-${++fakename}`,
                    type: 'staff',
                    isLeaf: true
                }
            ]
        },
        {
            url: 'http://www.baidu.com',
            text: `item-${++fakename}`,
            type: 'staff',
            isLeaf: true
        }
    ]
}
$(() => {
    Tester();
    const CONFIG = {
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
                btn: {
                    defaultName: '显示人员',
                    activeName: '隐藏人员',
                    handler: function(id, action) {
                        /**
                        * callback function to excute after user clicked this button
                        * @param {string} id - the identify of this node
                        * @param {SwitchAction} [action=0|1] - the action name, 0:OFF or 1:ON
                        **/
                        console.log(id, action ? 'ON' : 'OFF');
                    }
                }
            },
            staff: {
                icon: 'glyphicon glyphicon-user'
            }
        }
    }
    //初始化
    let vtree = $('.tree-box').vtree(Samples, CONFIG);

    function methodsExamples() {
        //重新加载id为2的节点
        vtree.load({
            id: 2
        }, function() {
            console.log('done');
        });

        //搜索‘xxx’(服务器端实现)
        vtree.load({
            keyword: 'xxx'
        }, function() {
            console.log('done');
        });
        //使用现成的JSON数据建树
        vtree.build(Samples);

        //展开id为4的节点
        vtree.expandNode(4, function() {
            console.log('done');
        });

        //折叠id为2的节点
        vtree.collapseNode(2);
    }

}
)
