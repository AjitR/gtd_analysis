import pandas as pd 
import numpy as np 
from flask import Flask
from flask import render_template
import json
import csv
import logging


app = Flask(__name__)

df2 = pd.read_csv(r'data/out_gtd.csv')
sun= pd.read_csv(r"data/out_sun.csv")
indexNames = sun[ sun['success'] == 0 ].index

sun.drop(indexNames , inplace=True)
sun1=sun.groupby(['attacktype1_txt'])['nkill','nwound'].sum()
sun1.to_csv("attack_count.csv")
@app.route("/")
def d3():
    #get country based data here based on clicks on choropleth
    #weapon type vs count
    df3=df2.groupby(['weaptype1_txt'])['weaptype1'].count().reset_index(name="count")
    piedata= df3.to_json(orient='records')
    piedata = json.dumps(piedata, indent=2)

    #attack type vs count
    df4=df2.groupby(['attacktype1_txt'])['attacktype1'].count().reset_index(name="count")
    bardata= df4.to_json(orient='records')
    bardata = json.dumps(bardata, indent=2)


    #sunburst

    output = {  "name": "TOTAL",
    'children': []}
    with open('attack_count.csv') as csv_file:
        for val in csv.DictReader(csv_file):
            output['children'].append({
                'name': val['attacktype1_txt'],
                'children': 
                [
                {'name':'nkill', 'size': float(val['nkill'])},
                {'name':'nwound', 'size': float(val['nwound'])},
                
                
                ]
                
                    
            })
    print(output)
    sundata = json.dumps(output)
    

    return render_template('index2.html',piedata=piedata,bardata=bardata,sundata=sundata)

if __name__ == "__main__":
    app.run( debug=True)