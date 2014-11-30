define('modules/admin-config', ['admin-util'],function(require,exports,module){
    var message=require('admin-util').message;
    var $document=$(document),$datagrid=$("#datagrid"),$dialog=$("#dialog_config")
        ,editIndex = undefined;

    var editorUtil={
        //字段名
        Field:{
            type:'textbox',
            options:{
                required:true,
                missingMessage:"请输入字段名称"
            }
        },
        //字段类型
        Type:{
            type:'combobox',
            options:{
                valueField: 'value',
                textField: 'text',
                height:24,
                panelHeight:"auto",
                data: [
                    {value: 'int',text: 'int'},
                    {value: 'varchar(32)',text: 'varchar(32)'},
                    {value: 'text',text: 'text'},
                    {value: 'blob',text: 'blob'},
                    {value: 'timestamp',text: 'timestamp'},
                    {value: 'datetime',text: 'datetime'},
                    {value: 'char(32)',text: 'char(32)'},
                    {value: 'float',text: 'float'},
                    {value: 'double',text: 'double'},
                    {value: 'bit',text: 'bit'}
                ],
                required:true,
                missingMessage:"请输入字段类型"
            }
        },
        //键约束
        Keys:{
            type:'combobox',
            options:{
                valueField: 'value',
                textField: 'text',
                height:24,
                panelHeight:"auto",
                data: [
                    {value: '',text: '自定义'},
                    {value: 'PRI',text: '主键'},
                    {value: 'UNI',text: '唯一'}
                ]
            }
        },
        //主键
        Key:{
            type:'checkbox',
            options:{on: "PRI",off:""}
        },
        //复选框
        Null:{
            type:'checkbox',
            options:{on: "YES",off:"NO"}
        },
        //是否自增
        Extra:{
            type:'checkbox',
            options:{on: "auto_increment",off:""}
        },
        //允许为null
        comboboxNull:{
            type:'combobox',
            options:{
                valueField: 'value',
                textField: 'text',
                height:24,
                panelHeight:"auto",
                data: [
                    {value: '',text: '自定义'},
                    {value: 'null',text: 'null'}
                ]
            }
        }
    };

    //结束编辑状态
    function endEditing(){
        if (editIndex == undefined){return true;}
        if ($datagrid.datagrid('validateRow', editIndex)){
            $datagrid.datagrid('endEdit', editIndex);
            editIndex = undefined;
            return true;
        } else {
            return false;
        }
    }

    //修改行
    function editRow(rowIndex){
        if(endEditing()){
            $datagrid.datagrid('endEdit', editIndex);
            $datagrid.datagrid('selectRow', rowIndex).datagrid('beginEdit', rowIndex);
            editIndex=rowIndex;
        }else{
            $datagrid.datagrid('selectRow', editIndex);
        }
    }

    //增加行
    function appendRow(rowIndex){
        if(endEditing()){
            var rowCount = $datagrid.datagrid('getRows').length;
            $datagrid.datagrid('endEdit', editIndex);
            $datagrid.datagrid("appendRow", {key:"",value:""});
            $datagrid.datagrid('selectRow', rowCount).datagrid('beginEdit', rowCount);
            editIndex=rowCount;
        }
    }

    //删除行
    function deleteRow(){
        var rowData=$datagrid.datagrid('getSelected');
        if(rowData!=null){
            $datagrid.datagrid('deleteRow', $datagrid.datagrid('getRowIndex',rowData));
        }else{
            message.error("请先选中要删除的行");
        }
    }

    $("#datagrid").datagrid({
        width:"100%",
        url:"/admin/config/findList.do",
        method:"get",
        queryParams: {},
        rownumbers:true,
        singleSelect:true,
        onClickRow: editRow,
        columns:[[
            {field:"id",hidden:true},
            {field:'key',title:'键[key]',width:'20%'},
            {field:'value',title:'值[value]',width:'60%',editor:'textbox'},
            {field:'view',title:'操作',width:'15%',formatter:function(value,row,index){
                return '<span class="l-btn-left l-btn-icon-left btn-delete" data-id="'+row.id+'" data-key="'+row.key+'" data-index="'+index+'"><span class="l-btn-text">删除</span><span class="l-btn-icon icon-remove"></span></span>';
            }}
        ]],
        toolbar: [{
            iconCls: 'icon-add',
            text:"增加",
            handler: function(){
                $("#input_key,#input_value").val("");
                $dialog.window('open');
            }
        },{
            iconCls: 'icon-save',
            text:"保存",
            handler: function(){
                if(endEditing()){
                    var vo=$datagrid.datagrid('getSelected');
                    $.post("/admin/config/insert.do",vo,function(result){
                        if(result.status){
                            message.ok("修改成功");
                        }else{
                            message.error("新增失败");
                        }
                    });
                }
            }
        }]
    });


    $document.on("click",".btn-delete",function(){
       var id=$(this).data("id"),index=$(this).data("index"),key=$(this).data("key");
        $.messager.confirm('删除提示','确定删除？',function(r){
            if (r){
                $.post("/admin/config/delete.do",{
                    id:id,
                    key:key
                },function(result){
                    if(result.status){
                        $("#datagrid").datagrid("deleteRow",index);
                        message.ok("删除成功");
                    }else{
                        message.error("删除失败");
                    }
                });
            }
        });
    });

    //点击取消按钮
    $document.on("click","#bt_cancel",function(){
        $dialog.window('close');
        $("#input_key,#input_value").val("");
    });

    //点击保存按钮
    $document.on("click","#bt_save",function(){
        if(endEditing()){
            var vo=$datagrid.datagrid('getSelected');
            $.post("/admin/config/insert.do",{
                key:$("#input_key").val(),
                value:$("#input_value").val()
            },function(result){
                if(result.status){
                    message.ok("新增成功",function(){
                        $("#input_key,#input_value").val("");
                        $datagrid.datagrid('appendRow',result.data);
                        $dialog.window('close');
                    });
                }else{
                    message.error(result.msg);
                }
            });
        }
    });

});