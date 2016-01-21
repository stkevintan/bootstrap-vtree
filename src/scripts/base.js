let fakename = 0;

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
const Samples = {
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
                    handler(id, action) {
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
        }, () => {
            console.log('done');
        });

        //搜索‘xxx’(服务器端实现)
        vtree.load({
            keyword: 'xxx'
        }, () => {
            console.log('done');
        });
        //使用现成的JSON数据建树
        vtree.build(Samples);

        //展开id为4的节点
        vtree.expandNode(4, () => {
            console.log('done');
        });

        //折叠id为2的节点
        vtree.collapseNode(2);
    }

    function EventsExamples() {
        function handler(e, id, $elem) {
            console.log('event :', e, 'id :', id, 'element :', $elem);
        }
        //绑定展开事件
        vtree.on('expand', handler);
        //绑定折叠事件
        vtree.on('collapse', handler);
        //删除绑定时间
        vtree.off('expand', handler);
    }
    EventsExamples();
}
)
