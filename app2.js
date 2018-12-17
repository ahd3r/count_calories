const StorageForData = (function(){
	return {
		getDataFromStorage:function(){
			const data = localStorage.getItem('data');
			return JSON.parse(data);
		},
		reWriteDataInStorage:function(data){
			localStorage.setItem('data',JSON.stringify(data));
		}
	};
})();

const Data = (function(){
	// this.id=id;
	// this.food=food;
	// this.calories=calories;
	return {
		getData:function(){
			return StorageForData.getDataFromStorage();
		},
		getCalories:function(){
			const datas = StorageForData.getDataFromStorage();
			let res = 0;
			datas.forEach((data)=>{
				res+=data.calories;
			});
			return res;
		},
		addItemToDataInStorage:function(id,food,calorise){
			let data = StorageForData.getDataFromStorage();
			data.push({id:id,food:food,calories:calorise});
			StorageForData.reWriteDataInStorage(data);
		}
	}
})();

const UI = (function(){
	return {
		renderData:function(data){
			console.log(data);
		},
		renderCounterCalories:function(calories){
			console.log(calories);
		},
		renderNothing:function(){
			console.log('Nothing');
		}
	}
})();

const App = (function(){
	return {
		start:function(){
			const getedData=Data.getData();
			if(getedData===null){
				StorageForData.reWriteDataInStorage([]);
				UI.renderNothing();
			} else if(getedData.length===0){
				UI.renderNothing();
			} else {
				UI.renderData(getedData);
				UI.renderCounterCalories(Data.getCalories());
			}
		}
	};
})();

App.start();
