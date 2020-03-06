// CPCS 324 Algorithms & Data Structures 2
// Graph data structure starter - Transitive Closure Package
// 2019, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// simple graph object with linked-list edge implementation and minimal fields
// extra vertex and edge member fields and methods to be added later as needed
//


var _v = [], _e = [];   // note naming conventions in upload guide


// -----------------------------------------------------------------------
function _main()   
{
    {
        // create a graph (default undirected)
        var g = new Graph();
    
        // set input graph properties (label, directed etc.)
        g.label = 'Exercise 8.4: 7 (Levitin, 3rd edition)';
        g.digraph = true;
    
        // use global input arrays _v and _e to initialize its internal data structures
        g.read_graph(_v, _e);
    
        // use printGraph() method to check graph
        g.printGraph();
    
        // perform breadth-first search and output stored result
        g.topoSearch(1);// 0 means DFS choice, while 1 means BFS choice of topological search
        document.write("<p>bfs_order: ", g.bfs_order, "</p>");
        
        // report connectivity status if available
        document.write("<p>", g.componentInfo(), "</p>");
    
        //output DFS-based transitive closure matrix
        g.dfsTC();
        document.write("<p> TC matrix by DFS:<br>");
        for (var i = 0; i < g.dfsTC.length; i++)
        {
            document.write(g.dfsTC[i], "<br>");
        }
        
        //output Warshall transitive closure matrix
        document.write("<p>TC matrix by Warshall-Floyd:<br>");
        g.warshallFloyd();
        for (var i = 0; i < g.warshallTC.length; i++)
        {
            document.write(g.warshallTC[i], "<br>");
        }
        
        //check if the graph is DAG (directed acyclic graph)
        document.write("<p>DAG: ", g.isDAG(), "</p>");
        
        //output floyed-distance matrix
        g.warshallFloyd();
        document.write("<p>Distance matrix<br>");
    
        for (var i = 0; i < g.floydD.length; i++)
        {
            document.write(g.floydD[i], "<br>");
        }
    }      
}


// -----------------------------------------------------------------------

function Vertex(v)
{

	
	this.label = v.label;
    this.visit = false; 		
    this.adjacent = new List();		
	
	
	// base member methods from P1M1
    this.adjacentByID = adjacentByIdImpl; 		
    this.incidentEdges = incidentEdgesImpl;		
    this.vertexInfo = vertexInfoImpl;			
    this.insertAdjacent = insertAdjacentImpl;
	
}
// -----------------------------------------------------------------------

function Edge(vert_i,weight)
{

	this.target_v = vert_i; 
    this.weight = weight;
	

}


// -----------------------------------------------------------------------

function Graph()
{
	// published docs section (ref. assignment page)
	// for this section, strip line comments
	// no JSDOC comments in this section
	
	
	// base property fields

	this.vert = [];
	this.nv = 0; 
	this.ne = 0;								
    this.digraph = false;
    this.weighted = false;						
    this.dfs_push = [];							
    this.bfs_order = [];						
    this.label = "";
    this.connectedComp = 0;						
    this.adjMatrix = [];	

	// base member methods
	
	this.read_graph = better_input;  // ... (complete next)
    this.listVerts = listVertsImpl;
    this.addEdge = addEdgeImpl3;				// Insert an edge
    this.printGraph = printGraphImpl;			
    this.makeGraph = makeGraphImpl;				// Create a graph
    this.dfs = dfsImpl;							// DFS a connected component
    this.bfs = bfsImpl;							// BFS a connected component
    this.makeAdjMatrix = makeAdjMatrixImpl3;	// Create adjacency matrix
    this.isConnected = isConnectedImpl;			// if graph connected returning true
    this.componentInfo = componentInfoImpl;		
    this.topoSearch = topoSearchImpl;
	
	// --------------------
	// more student fields next
	
	
	// --------------------
	// more student methods next 

	// transitive closure package (requirements in line comments, to be removed and replaced by JSDOCs) 
   /**
		@default [ ]
	*/
	this.floydD = [];
	/**
		@default [ ]
	*/
	this.warshallTC = [];
	/**
		@default [ ]
	*/
	this.dfsTC = [];

    
/**
		Check if there is a path between 2 vertix 
		@method
	*/
    this.hasPath = hasPathImpl;                  // boolean, true if path exists between vertices v_i, v_j in digraph
    
/**
	 length of the shortest path in wiegted graph
		@method
    */
    
	this.shortestPath =shortestPathImpl;              // return distance of shortest path between v_i, v_j in weighted graph 
    /**
		is it a diagraph is DAG 
		@method
	*/
    this.isDAG = isDAGImpl ;                  // boolean, true if acyclic digraph
   /**
		 TC matrix if is not weighed digraph, distance matrix if weighted
		@method
	*/ 
    this.warshallFloyd = warshallFloydImpl;           // inserts .tc field in adjacency matrix if digraph, and .dist if weighted
    /**
  Compute DFS-Based TC matrix
		@method
	*/
    this.dfsTC  = dfsTCImpl;                  // return TC matrix for digraph based on a dfs
		

}


// -----------------------------------------------------------------------
// functions used by methods of Graph and ancillary objects

// -----------------------------------------------------------------------
// begin student code section
// -----------------------------------------------------------------------

// transitive closure package 
/**
	Check if there is a path between two vertices using their IDs
	@author Amwaj alotibi
	@implements Graph#hasPath
	@param {integer} u_i Source 
	@param {integer} v_i target
	@returns {boolean} True if there is path 
*/


function hasPathImpl(u_i, v_i)
{
	return this.warshallTC[u_i][v_i] == 1? true : false;
}

/**
	Return the shortest path between two vertices using their IDs
	@author Amwaj alotibi
	@implements Graph#shortestPath
	@param {number} u_i Source 
	@param {number} v_i target 
	@returns {integer} The shortest path 
*/
function shortestPathImpl(u_i, v_i)
{
	return this.floydD[u_i][v_i];
}

/**
	Check if the given graph is Directed Acyclic Graph
	@author Amwaj alotibi
	@implements Graph#isDAG
	@returns {boolean} True if is it DAG
*/
function isDAGImpl()
{
	for (var i = 0, j = 0; i < this.warshallTC.length && j < this.warshallTC.length; i++, j++)
		if (this.hasPath(i, j))
			return false;
	return true;
}


// -----------------------------------------------------------------------
// published docs section (ref. assignment page)
// use starter6-based P1M1 code as-is (fixes/improvements OK)
// no JSDOC comments in this section (docs already published)
// -----------------------------------------------------------------------

/**
	Finds the shortest distance from one vertex to all the other vertices
	@author Amwaj alotibi
	@implements Graph#warshallFloyd
*/
function warshallFloydImpl()
{
    
    this.makeAdjMatrix();

    //Fill  warshallTC[] , floydD[] by adjacent matrix
    for (var k = 0; k < this.adjMatrix.length; k++)
    {
        // row by row will be copyed
        this.warshallTC[k] = this.adjMatrix[k].slice();
        this.floydD[k] = this.adjMatrix[k].slice();
        for (var x = 0; x < this.nv; x++)
        {
            if (this.adjMatrix[k][x] == 0 &&  k!=x)
            {
                this.floydD[k][x] = Infinity;
            }
        }
    }

    // warshall-Floyed 
    for (var k = 0; k < this.floydD.length; k++)
    {
        for (var i = 0; i < this.floydD.length; i++)
        {
            for (var j = 0; j < this.floydD.length; j++)
            {
                this.floydD[i][j] = Math.min(this.floydD[i][j], (this.floydD[i][k] + this.floydD[k][j]));
                this.warshallTC[i][j] = this.warshallTC[i][j] || (this.warshallTC[i][k] && this.warshallTC[k][j])?1:0;
            }
        }
    }

    //if there is no distance change the value to 0 
    for (var i = 0; i < this.floydD.length; i++)  
        for (var j = 0; j < this.floydD.length; j++)     
            if (this.floydD[i][j] == Infinity)         
                this.floydD[i][j] = 0;    

}
/**
	Finds the shortest distance from one vertex to all the other vertices (with better efficiency)
	@author Amwaj alotibi
	@implements Graph#dfsTC
*/
function dfsTCImpl()
{
    for (var i = 0; i < this.nv; i++)
    {
        var v = this.vert[i];

        //  all vertices unvisited
        for (var p = 0; p < this.nv; p++)
        {
            this.vert[p].visit = false;
        }

        // create the corresponding row 
        this.dfsTC[i] = [];
        for (var j = 0; j < this.nv; j++)
            this.dfsTC[i][j] = 0;

        //call DFS search for each adjacent to the vertex v by its id
        var w = v.adjacentByID();
        for (var n = 0; n < w.length; n++)
            this.dfs(w[n]); 

        //check which vertices are visited
        for (var k = 0; k < this.nv; k++)
        {
            //if visited set 1 in the corresponding TC matrix
            if (this.vert[k].visit)
            {
                this.dfsTC[i][k] = 1;
            }
        }
    }
}
function addEdgeImpl(u_i, v_i)
{
    //fetch vertices using their idm where u: edge source vertex, v: target vertex
    var u = this.vert[u_i],
        v = this.vert[v_i];

    //insert (u,v), i.e. insert v (by id) in adjacency list of u
    u.adjacent.insert(v_i);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        v.adjacent.insert(u_i);
    }
}

// --------------------
function addEdgeImpl2(u_i, v_i, weight)
{
    // fetch vertices using their id, where u: edge source vertex, v: target vertex
    var u = this.vert[u_i],
        v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass object)
    var e = new Edge();
    e.target_v = v_i;
    e.weight = weight;
    u.adjacent.insert(e);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        e = new Edge();
        e.target_v = u_i;
        e.weight = weight;
        v.adjacent.insert(e);
    }


}
function addEdgeImpl3(u_i, v_i, weight)
{
    // fetch vertices using their id, where u: edge source vertex, v: target vertex
    var u = this.vert[u_i],
        v = this.vert[v_i];

    // insert (u,v), i.e., insert v in adjacency list of u
    // (first create edge object using v_i as target, then pass object)
    u.insertAdjacent(v_i, weight);

    // insert (v,u) if undirected graph (repeat above but reverse vertex order)
    if (!this.digraph)
    {
        v.insertAdjacent(u_i, weight);
    }
}
function adjacentByIdImpl()
{
    var adjacentArr = [];
    var adjacency_list = this.adjacent.traverse();
    for (var i = 0; i < adjacency_list.length; i++)
    {
        adjacentArr[i] = adjacency_list[i].target_v;
    }
    return adjacentArr;
}

// --------------------
function better_input(v, e)
{
    // set number of vertices and edges fields
    this.nv = v.length;
    this.ne = e.length;
    // input vertices into internal vertex array
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i] = new Vertex(v[i]);
    }
    // input vertex pairs from edge list input array
    // remember to pass vertex ids to add_edge() 
    for (var i = 0; i < this.ne; i++)
    {
        this.addEdge(e[i].u, e[i].v, e[i].w);
    }
    // double edge count if graph undirected 
    if (!this.digraph)
    {
        this.ne = e.length * 2;
    }
    // check if the graph is weighted or not 
    if (!(e[0].w == undefined))
    {
        this.weighted = true;
    }
}

// --------------------
function better_output()
{
    // note bad pattern for long-term code
    var out;
    switch (this.connectedComp)
    {
        case 0:
            out = "no connectivity info";
            break;
        case 1:
            out = "CONNECTED";
            break;
        default:
            out = "DISCONNECTED " + this.connectedComp;
            break;
    }

    document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "" : "UN", "WEIGHTED, ", this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ", this.ne, " EDGES:</p>", out, "</p>");

    // list vertices
    this.list_vert();
}

// --------------------
function bfsImpl(v_i)
{
    // get vertex v by its id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;
    this.bfs_order[this.bfs_order.length] = v_i;

    // initialize queue with v
    var q = new Queue();
    q.enqueue(v);

    // while queue not empty
    while (!q.isEmpty())
    {
        // dequeue and process a vertex, u
        var u = q.dequeue();

        // queue all unvisited vertices adjacent to u
        var w = u.adjacentByID();
        for (var i = 0; i < w.length; i++)
        {
            if (!this.vert[w[i]].visit)
            {
                this.vert[w[i]].visit = true;
                q.enqueue(this.vert[w[i]]);
                this.bfs_order[this.bfs_order.length] = w[i];
            }
        }
    }
}

// --------------------
function componentInfoImpl()
{
    var out;
    switch (this.connectedComp)
    {
        case 0:
            out = "no connectivity info";
            break;
        case 1:
            out = "CONNECTED";
            break;
        default:
            out = "DISCONNECTED " + this.connectedComp;
            break;
    }
    return out;
}

// --------------------
function dfsImpl(v_i)
{
    // get vertex v by its id
    var v = this.vert[v_i];

    // process v 
    v.visit = true;
    this.dfs_push[this.dfs_push.length] = v_i;

    // recursively traverse unvisited adjacent vertices 
    var w = v.adjacentByID();
    for (var i = 0; i < w.length; i++)
    {
        if (!this.vert[w[i]].visit)
        {
            this.dfs(w[i]);
        }
    }
}

// --------------------
function incidentEdgesImpl()
{
    //array of objects
    var enode = [];
    var w = this.adjacent.traverse();
    for (var i = 0; i < w.length; i++)
    {
        enode[i] = {
            "adjVert_i": w[i].target_v,
            "edgeLabel": "",
            "edgeWeight": w[i].weight
        }
    }
    return enode;
}

// --------------------
function insertAdjacentImpl(v_i, weight)
{
    this.adjacent.insert(new Edge(v_i, weight));
}

// --------------------
function isConnectedImpl()
{
    return this.connectedComp == 0 ? true : false;
}

// --------------------
function listVertsImpl()
{
    var i, v; // local variables
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        document.write("VERTEX: ", i, v.vertexInfo(), "<br>");
    }
}

// --------------------
function makeAdjMatrixImpl()
{
    //adjacency matrix initialzied by zero
    for (var i = 0; i < this.nv; i++)
    {
        this.adjMatrix[i] = [];

        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }
    }

    // when vertex has an adjacency set 1
    var v, w;
    for (var i = 0; i < this.nv; i++)
    {
        v = this.vert[i];
        w = v.adjacentById();
        for (var j = 0; j < w.length; j++)
        {
            this.adjMatrix[i][w[j]] = 1;
        }
    }
}

// --------------------
function makeAdjMatrixImpl2()
{
    for (var i = 0; i < this.nv; i++)
    {
        //get vertex
        var v = this.vert[i];

        //create and initialize the corresponding row
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        //process adjacent vertices: get by edge node, set value for each
        var e = v.adjacent.traverse(),
            m = e.length; //note encap mistake
        for (var j = 0; j < m; j++)
        {
            this.adjMatrix[i][e[j].target_v] = this.weighted ? e[j].weight : 1;
        }
    }
}

// --------------------
function makeAdjMatrixImpl3()
{
    for (var i = 0; i < this.nv; i++)
    {
        //get vertex
        var v = this.vert[i];

        //create and initialize the corresponding row
        this.adjMatrix[i] = [];
        for (var j = 0; j < this.nv; j++)
        {
            this.adjMatrix[i][j] = 0;
        }

        //process adjacent vertices: get by edge node, set value for each
        var e = v.adjacentByID();
        var info = v.incidentEdges();
        for (var j = 0; j < e.length; j++)
        {
            this.adjMatrix[i][e[j]] = this.weighted ? info[j].edgeWeight : 1;
        }
    }
}

// --------------------
function makeGraphImpl(n, m, w)
{

}

// --------------------
function printGraphImpl()
{
    document.write("<p>GRAPH {", this.label, "} ", this.weighted ? "" : "UN", "WEIGHTED, ", this.digraph ? "" : "UN", "DIRECTED - ",
        this.nv, " VERTICES, ", this.ne, " EDGES:</p>", this.componentInfo(), "</p>");

    // list vertices
    this.listVerts();
}

// --------------------
function topoSearchImpl(fun)
{
    // mark all vertices unvisited
    for (var i = 0; i < this.nv; i++)
    {
        this.vert[i].visit = false;
    }
    // traverse a connected component 	
    for (var i = 0; i < this.nv; i++)
    {
        if (!this.vert[i].visit)
        {
            fun == 0 ? (this.connectedComp++, this.dfs(i)) : (this.connectedComp++, this.bfs(i));
        }
    }
}

// --------------------
function vertexInfoImpl()
{
    return " {" + this.label + "} - VISIT: " + this.visit + " - ADJACENCY: " + this.adjacentByID();
}