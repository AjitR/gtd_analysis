import pandas as pd 
import numpy as np 
from flask import Flask
from flask import render_template
import json
import csv
import logging
from flask import request


app = Flask(__name__)

df2 = pd.read_csv(r'data/gtd_code.csv')
sun= pd.read_csv(r"data/out_sun.csv")
indexNames = sun[ sun['success'] == 0 ].index

sun.drop(indexNames , inplace=True)
sun1=sun.groupby(['attacktype1_txt'])['nkill','nwound'].sum()
sun1.to_csv("attack_count.csv")

#sunburst data
sundf= df2.groupby(['targtype1_txt','attacktype1_txt']).size().reset_index(name="Time")
sundf.to_csv("sunburst.csv")
@app.route("/")
def d3():
  
    # output = {  "name": "TOTAL",
    # 'children': []}
    # with open('attack_count.csv') as csv_file:
    #     for val in csv.DictReader(csv_file):
    #         output['children'].append({
    #             'name': val['attacktype1_txt'],
    #             'children': 
    #             [
    #             {'name':'nkill', 'size': float(val['nkill'])},
    #             {'name':'nwound', 'size': float(val['nwound'])},
                             
    #             ]
           
    #         })

    
    

    return render_template('index2.html')


def dfbycountry(countrycode):
    dfcountry= df2.loc[df2['code'] ==countrycode] 
    return dfcountry

#pie data
@app.route('/getDataPerCountryPie')
def getDataPerCountryPie():
    country = request.args.get('country', type=str)
    if country=='All':
        countdf=df2.groupby('success')['success'].count().reset_index(name="count")
        piedata= countdf.to_json(orient='records')
        piedata = json.dumps(piedata, indent=2)
        return piedata
    else:
        countdf1= dfbycountry(country)
        countdf1=countdf1.groupby('success')['success'].count().reset_index(name="count")
        piedata1= countdf1.to_json(orient='records')
        piedata1 = json.dumps(piedata1, indent=2)
        return piedata1

#sunburst data
@app.route('/getDataSun')
def getDataSun():
    country = request.args.get('country', type=str)
    if country=='All':
        output = {  "name": "TOTAL",
        'children': []}
        with open('sunburst.csv') as csv_file:
            for val in csv.DictReader(csv_file):
                output['children'].append({
                    'name': val['attacktype1_txt'],
                    'children': 
                    [
                    {'name':val['targtype1_txt'], 'size': float(val['Time'])}             
                    ]
            
                })
        
        sundata = json.dumps(output)
        return sundata
    else:
        countdf1= dfbycountry(country)
        sundf= countdf1.groupby(['targtype1_txt','attacktype1_txt']).size().reset_index(name="Time")
        sundf.to_csv("sunburst1.csv")
        output1 = {  "name": "TOTAL",
        'children': []}
        with open('sunburst1.csv') as csv_file:
            for val in csv.DictReader(csv_file):
                output1['children'].append({
                    'name': val['attacktype1_txt'],
                    'children': 
                    [
                    {'name':val['targtype1_txt'], 'size': float(val['Time'])}             
                    ]
            
                })
        
        sundata1 = json.dumps(output1)
        return sundata1






if __name__ == "__main__":
    app.run( debug=True)