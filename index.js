'use strict';

const fs = require('fs');
const process = require('process');

const file = process.argv[2];



fs.readFile(file, 'UTF8', (err, data) => {
    if (err){
        console.error(err);
        return 0;
    }

    let mesh = {};
    const v_re = /(?<=v\s+)\d+\s+\d+\s+\d+/g;
    let max_pos = 0;

    const f_re = /(?<=f\s+)\d+\s+\d+\s+\d+/g;

    mesh.vertices = data.match(v_re).map( str => 
        str.split(/\s+/).map( n => {
            Number(n);
            max_pos = n > max_pos ? n : max_pos;
            return (n);
        })
    );

    //normalize vert
    mesh.vertices = mesh.vertices.map(arr => 
            arr.map(vertice =>
                    vertice /= max_pos
                )
        );

    console.log('Vertices:\n', mesh.vertices);
                
    mesh.triangles = data.match(f_re).map( str => 
        str.split(/\s+/).map( n => 
            Number(n) - 1 //triangle number start 0
        )
    );

    console.log('Triangles\n', mesh.triangles);

    fs.writeFile(`${file.match(/[^.]+/)[0]}.json`, JSON.stringify(mesh), err =>{
        if (err)
            console.error(err);
        }
    );
  });