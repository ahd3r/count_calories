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
		},
		changeOneFromStorage:function(id,food,calorise){
			const data = StorageForData.getDataFromStorage();
			let res;
			data.forEach((item,index)=>{
				if(item.id===id){
					res=index;
				}
			});
			data[res]={id:id,food:food,calories:calorise};
			StorageForData.reWriteDataInStorage(data);
		},
		deleteOneFromData:function(id){
			const currentData = StorageForData.getDataFromStorage();
			let i;
			currentData.forEach((item,index)=>{
				if(item.id===id){
					i = index;
				}
			});
			currentData.splice(i,1);
			StorageForData.reWriteDataInStorage(currentData);
		}
	}
})();

const UI = (function(){
	return {
		afterClean:function(){
			if(document.querySelector('.secondrow')){
				document.querySelector('.secondrow').remove();
			}
			if(document.querySelector('.thirdrow')){
				document.querySelector('.thirdrow').remove();
			}
			document.querySelector('.container').appendChild(document.createElement('div')).className='row secondrow';
			document.querySelector('.secondrow').appendChild(document.createElement('div')).className='col';
			document.querySelector('.secondrow>.col').appendChild(document.createElement('h5')).className='text-center';
			document.querySelector('.secondrow>.col>h5').textContent='It has been cleared! <3';
		},
		renderEdit:function(c){
			if(document.querySelector('.addMeal')){
				document.querySelector('.addMeal').remove();
				document.querySelector('.card-content').appendChild(document.createElement('form')).className='editMeal';
				document.querySelector('.editMeal').innerHTML=`
				<div class="row">
					<div class="col input-field">
						<label for="food">Food</label>
						<input type="text" id="food">
					</div>
					<div class="col input-field">
						<label for="calories">Calories</label>
						<input type="number" id="calories">
					</div>
				</div>
				<div class="row">
					<div class="col">
						<button class="btn ml-2 right grey bck-btn waves-effect">Back</button>
						<button class="btn ml-2 right red del-btn waves-effect">Delete</button>
						<button class="btn ml-2 upd-btn right orange waves-effect">Update</button>
					</div>
				</div>
				`;
			} else {
				document.querySelector('.editMeal').remove();
				document.querySelector('.card-content').appendChild(document.createElement('form')).className='editMeal';
				document.querySelector('.editMeal').innerHTML=`
				<div class="row">
					<div class="col input-field">
						<label for="food" class="active">Food</label>
						<input type="text" id="food">
					</div>
					<div class="col input-field">
						<label for="calories" class="active">Calories</label>
						<input type="number" id="calories">
					</div>
				</div>
				<div class="row">
					<div class="col">
						<button class="btn ml-2 right grey bck-btn waves-effect">Back</button>
						<button class="btn ml-2 right red del-btn waves-effect">Delete</button>
						<button class="btn ml-2 upd-btn right orange waves-effect">Update</button>
					</div>
				</div>
				`;
			}
			document.querySelector('#food').value=c.target.parentElement.parentElement.firstChild.textContent;
			const stringForCalories=document.querySelector(`.${c.path[2].classList[1]}>em`).textContent;
			const calories=stringForCalories.match(/\d+/);
			document.querySelector('#calories').value=calories[0];
			document.querySelector('.bck-btn').addEventListener('click',function(e){
				document.querySelector('.editMeal').remove();
				document.querySelector('.card-content').appendChild(document.createElement('form')).className='addMeal';
				document.querySelector('.addMeal').innerHTML=`
				<div class="row">
					<div class="col input-field">
						<label for="food">Food</label>
						<input type="text" id="food">
					</div>
					<div class="col input-field">
						<label for="calories">Calories</label>
						<input type="number" id="calories">
					</div>
				</div>
				<div class="row">
					<div class="col">
						<button type="submit" class="add-item btn pl-5 pr-5 right blue darken-1 waves-effect">Add Item</button>
					</div>
				</div>
				`;
				e.preventDefault();
			});
			document.querySelector('.upd-btn').addEventListener('click',function(e){
				const inputCalories = document.querySelector('#calories').value;
				const inputFood = document.querySelector('#food').value;
				if(inputCalories===''||inputFood===''){
					UI.renderError('Fill all line');
				}else if(parseInt(inputCalories)===0 || parseInt(inputCalories)<0){
					UI.renderError('Calories can be less or equel to 0');
				}else{
					const id = c.target.parentElement.parentElement.classList[1];
					const idintify=id.match(/\d+/);
					Data.changeOneFromStorage(parseInt(idintify[0]), inputFood, parseInt(inputCalories));
					document.querySelector('.editMeal').remove();
					document.querySelector('.card-content').appendChild(document.createElement('form')).className='addMeal';
					document.querySelector('.addMeal').innerHTML=`
					<div class="row">
						<div class="col input-field">
							<label for="food">Food</label>
							<input type="text" id="food">
						</div>
						<div class="col input-field">
							<label for="calories">Calories</label>
							<input type="number" id="calories">
						</div>
					</div>
					<div class="row">
						<div class="col">
							<button type="submit" class="add-item btn pl-5 pr-5 right blue darken-1 waves-effect">Add Item</button>
						</div>
					</div>
					`;
					UI.renderCounterCalories(Data.getCalories());
					UI.renderData(Data.getData());
				}
				e.preventDefault();
			});
			document.querySelector('.del-btn').addEventListener('click',function(e){
				const data = Data.getData();
				if(data.length<=1){
					StorageForData.reWriteDataInStorage([]);
					document.querySelector('.editMeal').remove();
					document.querySelector('.card-content').appendChild(document.createElement('form')).className='addMeal';
					document.querySelector('.addMeal').innerHTML=`
					<div class="row">
						<div class="col input-field">
							<label for="food">Food</label>
							<input type="text" id="food">
						</div>
						<div class="col input-field">
							<label for="calories">Calories</label>
							<input type="number" id="calories">
						</div>
					</div>
					<div class="row">
						<div class="col">
							<button type="submit" class="add-item btn pl-5 pr-5 right blue darken-1 waves-effect">Add Item</button>
						</div>
					</div>
					`;
					UI.renderNothing();
				}else{
					const id = c.target.parentElement.parentElement.classList[1];
					const idintify=id.match(/\d+/);
					Data.deleteOneFromData(idintify);
					document.querySelector('.editMeal').remove();
					document.querySelector('.card-content').appendChild(document.createElement('form')).className='addMeal';
					document.querySelector('.addMeal').innerHTML=`
					<div class="row">
						<div class="col input-field">
							<label for="food">Food</label>
							<input type="text" id="food">
						</div>
						<div class="col input-field">
							<label for="calories">Calories</label>
							<input type="number" id="calories">
						</div>
					</div>
					<div class="row">
						<div class="col">
							<button type="submit" class="add-item btn pl-5 pr-5 right blue darken-1 waves-effect">Add Item</button>
						</div>
					</div>
					`;
					UI.renderCounterCalories(Data.getCalories());
					UI.renderData(Data.getData());
				}
				e.preventDefault();
			});
		},
		renderData:function(items){
			if(document.querySelector('.thirdrow')){
				document.querySelector('.thirdrow').remove();
			}
			document.querySelector('#food').value='';
      document.querySelector('#calories').value='';
      document.querySelector('.container').appendChild(document.createElement('div')).className='row thirdrow';
      document.querySelector('.thirdrow').appendChild(document.createElement('div')).className='col';
      document.querySelector('.thirdrow>.col').appendChild(document.createElement('ul')).className='collection';
      document.querySelector('.thirdrow>.col>.collection').setAttribute('id','item-list');
      items.forEach(item=>{
        document.querySelector('#item-list').appendChild(document.createElement('li')).className=`collection-item item-${item.id} text-center`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('strong')).textContent=`${item.food}`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('em')).textContent=` | calories: ${item.calories}`;
        document.querySelector(`.item-${item.id}`).appendChild(document.createElement('a')).className='secondary-content';
        document.querySelector(`.item-${item.id}>a`).setAttribute('href','#!');
        document.querySelector(`.item-${item.id}>a`).appendChild(document.createElement('i')).className=`edit-for-${item.id} small material-icons classForOpacity`;
        document.querySelector(`.edit-for-${item.id}`).textContent='create';
        document.querySelector(`.item-${item.id}`).addEventListener('mouseover',function(){
          document.querySelector(`.edit-for-${item.id}`).className=`edit-for-${item.id} small material-icons`;
        });
        document.querySelector(`.item-${item.id}`).addEventListener('mouseout',function(){
          document.querySelector(`.edit-for-${item.id}`).className=`edit-for-${item.id} small material-icons classForOpacity`;
				});
				document.querySelector(`.item-${item.id}`).addEventListener('click',UI.renderEdit);
			});
		},
		renderCounterCalories:function(calories){
			if(document.querySelector('.secondrow')){
				document.querySelector('.secondrow').remove();
			}
			document.querySelector('.container').appendChild(document.createElement('div')).className='row secondrow';
			document.querySelector('.secondrow').appendChild(document.createElement('div')).className='col';
			document.querySelector('.secondrow>.col').appendChild(document.createElement('h4')).className='text-center';
			document.querySelector('.secondrow>.col>h4').textContent=`Total calories: ${calories}`;
		},
		renderNothing:function(){
			if(document.querySelector('.secondrow')){
				document.querySelector('.secondrow').remove();
			}
			if(document.querySelector('.thirdrow')){
				document.querySelector('.thirdrow').remove();
			}
			document.querySelector('.container').appendChild(document.createElement('div')).className='row secondrow';
			document.querySelector('.secondrow').appendChild(document.createElement('div')).className='col';
			document.querySelector('.secondrow>.col').appendChild(document.createElement('h5')).className='text-center';
			document.querySelector('.secondrow>.col>h5').textContent='You did not eat anything yet.';
		},
		renderError:function(msg){
			document.querySelector('.container').insertBefore(document.createElement('div'),document.querySelector('.row')).className='row forError mt-2 mb-0';
			document.querySelector('.forError').appendChild(document.createElement('div')).className='col';
			document.querySelector('.forError>.col').appendChild(document.createElement('div')).className='alert alert-danger';
			document.querySelector('.alert').setAttribute('role','alert');
			document.querySelector('.alert').textContent=msg;
			setTimeout(function(){
				document.querySelector('.forError').remove();
			},2000);
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
				UI.renderCounterCalories(Data.getCalories());
				UI.renderData(getedData);
			}
		},
		addEvent:function(){
			document.querySelector('.clear-btn').addEventListener('click',function(){
				const check = Data.getData();
				if(check.length===0){
					UI.renderError('This is already empty');
				}else{
					StorageForData.reWriteDataInStorage([]);
					UI.afterClean();
				}
			});
			if(document.querySelector('.addMeal')){
				document.querySelector('.addMeal').addEventListener('submit',function(e){
					let inputCalories = document.querySelector('#calories').value;
					const inputFood = document.querySelector('#food').value;
					if(inputFood==='' || inputCalories===''){
						UI.renderError('Fill all line');
					} else if(parseInt(inputCalories)===0){
						UI.renderError('Calories can not be 0');
					} else if(parseInt(inputCalories)<0){
						UI.renderError('Calories can not be less then 0');
					} else {
						inputCalories=parseInt(inputCalories);
						let currentData = Data.getData();
						if(currentData.length===0){
							Data.addItemToDataInStorage(1,inputFood,inputCalories);
						}else{
							const lastData = currentData[currentData.length-1];
							Data.addItemToDataInStorage(lastData.id+1,inputFood,inputCalories);
						}
						UI.renderCounterCalories(Data.getCalories());
						UI.renderData(Data.getData());
					}
					e.preventDefault();
				});
			}
		}
	};
})();

App.start();
App.addEvent();
