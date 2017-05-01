var new_columns_config=[
	{insertion_pos:'Name',
	 col_header:'PAO1',
	 new_col: {
        'data':'Paref',
        'render':
            function(data, type, row, meta){
                return ' <a href="http://pseudomonas.com/primarySequenceFeature/list?strain_ids=107&term=Pseudomonas+aeruginosa+PAO1+%28Reference%29&c1=name&v1='+data+'+&e1=1&assembly=complete" target="_blank">'+data+'</a>';
            }
        }
    }
];