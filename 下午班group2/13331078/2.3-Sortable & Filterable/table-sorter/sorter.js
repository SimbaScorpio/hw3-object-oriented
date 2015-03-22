/* 13331078 胡江川 */
window.onload = function() {
	var tables = document.getElementsByTagName('table');
	makeFilterable(makeSortable(tables[0]));
	makeSortable(makeFilterable(tables[1]));
}

function makeSortable(table) {
	var offset = 1;    //默认从属性第一行开始
	var theads = findThead(table);   //寻找菜单栏
	cssStyle(table, theads);
	for(var i = 0; i < theads.length; ++i) {
		theads[i].className = 'thread';
		function closure(){
			var index = i;      //记录第几列
			var flag = true;    //记录排序方式
			theads[i].onclick = function(){
				cssStyle(table, theads);
				var lines = table.getElementsByTagName('tr');
				//1.构建table二维数组
				var list = new Array();
				for(var i = offset; i < lines.length; ++i) {
					if(lines[i].visible == undefined || lines[i].visible == true) {
						var elements = lines[i].getElementsByTagName("td");
						var tempLine = new Array();
						for(var j = 0; j < elements.length; ++j) {
							var regRecover = /<span id=\"matched\">|<\/span>/g;  //复原防止<span>标签影响排序结果！
							elements[j].innerHTML = elements[j].innerHTML.replace(regRecover, "");
							tempLine.push(elements[j].innerHTML);
						}
						list.push(tempLine);
					}
				}
				//2.sort二维数组排序
				list.sort(function(x, y) {
					if(isNaN(x[index]) && isNaN(y[index]))
						if(flag == true)
							return x[index].localeCompare(y[index]);
						else
							return y[index].localeCompare(x[index]);
					else
						if(flag == true)
							return parseFloat(x[index]) > parseFloat(y[index]) ? 1 : -1;
						else
							return parseFloat(x[index]) < parseFloat(y[index]) ? 1 : -1;
				});
				flag = !flag;
				//3.将排好序的list赋值回表格
				var count=0;
				for(var i = offset; i < lines.length; ++i) {
					if(lines[i].visible == undefined || lines[i].visible == true) {
						var elements = lines[i].getElementsByTagName("td");
						for(var j = 0; j < elements.length; ++j) {
							elements[j].innerHTML = list[count][j];
						}
						++count;
					}
				}
				//keep font color
				filter(table, table.getElementsByTagName('input')[0].value);
				//css
				this.style.backgroundColor = "#a6affc";
				if(flag == true)
					this.style.backgroundImage = "url(ascend.png)";
				else
					this.style.backgroundImage = "url(descend.png)";
			}
		};
		closure();
	}
	return table;
}

function findThead(table) {
	//如果不存在th元素，默认第一行为菜单栏
	var theads = table.getElementsByTagName('th');
	if(theads.length == 0) {
		theads = table.getElementsByTagName('tr')[0].getElementsByTagName('td');
	}
	return theads;
}

function cssStyle(table, theads) {
		//css菜单栏及箭头
		for(var i = 0; i < theads.length; ++i) {
			theads[i].style.backgroundColor = "#021A7E";
			theads[i].style.backgroundImage = "";
		}
		//css行与行间颜色差别
		var lines = table.getElementsByTagName("tr");
		var count = 1;
		for(var j = 1; j < lines.length; ++j) {
			if(lines[j].visible == undefined || lines[j].visible == true) {
				if(count % 2 == 0) {
					lines[j].style.backgroundColor = "lightgray";
				} else {
					lines[j].style.backgroundColor = "white";
				}
				++count;
			}
		}
}

function makeFilterable(table) {
	var inputBox = document.createElement('input');
	var text = inputBox.value;
	setInterval(function() {
		if(text != inputBox.value) {
			filter(table, inputBox.value);
			text = inputBox.value;
		}
	}, 100);
	table.appendChild(inputBox);
	return table;
}

function filter(table, text) {
	var offset = 1;
	var lines = table.getElementsByTagName('tr');
	if(text == "") {           //输入为空时显示整个table
		for(var i = offset; i < lines.length; ++i) {
			lines[i].style.display = "";
			lines[i].visible = true;
			var regRecover = /<span id=\"matched\">|<\/span>/g;  //消除<span>
			lines[i].innerHTML = lines[i].innerHTML.replace(regRecover, "");
		}
	} else {
		for(var i = offset; i < lines.length; ++i) {
			var elements = lines[i].getElementsByTagName('td');
			var flag = false;
			for(var j = 0; j < elements.length; ++j) {               //正则匹配，红色凸显
				var regRecover = /<span id=\"matched\">|<\/span>/g;   //消除<span>
				elements[j].innerHTML = elements[j].innerHTML.replace(regRecover, "");
				var re = eval('/' + text + '/ig');
				var count = 0;
				var matched_words;
				var temp = elements[j].innerHTML;
				while((matched_words = re.exec(elements[j].innerHTML)) != null) {
					var str1 = temp.substring(0, re.lastIndex - text.length + 26*count);
					var str2 = temp.substring(re.lastIndex + 26*count);
					var to_change = '<span id="matched">' + matched_words[0] + '</span>';
					temp = str1 + to_change + str2;
					++count;
					flag = true;
				}
				elements[j].innerHTML = temp;
			}
			if(flag == false) {                    //隐藏不包含关键字的行
				lines[i].style.display = "none";
				lines[i].visible = false;
			} else {
				lines[i].style.display = "";
				lines[i].visible = true;
			}
		}
	}
	cssStyle(table, findThead(table));
}