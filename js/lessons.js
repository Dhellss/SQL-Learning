const SECTIONS = [
  {id:'s1', title:'Basics'},
  {id:'s2', title:'Filtering and counting'},
  {id:'s3', title:'Combining tables'},
  {id:'s4', title:'Changing data'},
  {id:'s5', title:'Building tables'}
];

const LESSONS = [
{id:'intro', sec:'s1', title:'What is SQL?', short:'What is SQL',
body:`
<p><mark>SQL</mark> (Structured Query Language, pronounced "ess-cue-ell" or "sequel") is the language used to talk to a <strong>database</strong>. With SQL you can read, add, change, and delete data.</p>
<p>It's used almost everywhere: banks, online shops, schools, hospitals, and the apps on your phone.</p>
<h2>Think of it like a cabinet</h2>
<p>A database is like a large, well-organized cabinet. Inside it are <strong>tables</strong>, which look a lot like sheets in Excel.</p>
<ul>
<li>A <strong>column</strong> is a type of information, for example Name, City, or Age.</li>
<li>A <strong>row</strong> is one complete record, for example one customer.</li>
</ul>
<h2>Your first query</h2>
<p>A <strong>query</strong> is a question or command written in SQL. Press <strong>Run</strong> below to see what's inside the Customers table.</p>
<div class="runner">SELECT * FROM Customers;</div>
<div class="note"><p><strong>Try it:</strong> replace <code>Customers</code> with <code>Products</code> or <code>Orders</code>, then run it again. Shortcut: Ctrl + Enter (Cmd + Enter on Mac).</p></div>
<h2>A few rules to remember</h2>
<ul>
<li>Keywords are not case-sensitive. <code>SELECT</code> and <code>select</code> are the same, but writing them in capitals makes queries easier to read.</li>
<li>Each statement ends with a semicolon (<code>;</code>).</li>
<li>Text goes inside single quotes, for example <code>'Baguio'</code>.</li>
<li>A line starting with <code>--</code> is a comment. It isn't run; it's a note for humans.</li>
</ul>
<h2>Many databases, one language</h2>
<p>There are many database systems: MySQL, PostgreSQL, SQL Server, Oracle, and SQLite. All of them use SQL. Here on SQDhell, SQLite runs right inside your browser, but almost everything you learn works in any database.</p>
`,
quiz:{q:'What do you call one complete record in a table, such as one customer?',opts:['Column','Row','Database','Query'],a:1,exp:'A row is one complete record. A column is a type of information, like Name or City.'}
},

{id:'select', sec:'s1', title:'SELECT: Getting data', short:'SELECT',
body:`
<p><mark>SELECT</mark> is the command you'll use most. It says what data you want to see, and from which table.</p>
<pre class="syntax">SELECT column1, column2
FROM table_name;</pre>
<h2>Pick a few columns</h2>
<p>Write the names of the columns you want, separated by commas.</p>
<div class="runner">SELECT Name, City FROM Customers;</div>
<h2>Get every column</h2>
<p>Use an asterisk (<code>*</code>) when you want all columns.</p>
<div class="runner">SELECT * FROM Products;</div>
<div class="note"><p><strong>Good habit:</strong> in real work, name only the columns you need instead of using <code>*</code>. It's faster and the result is clearer.</p></div>
`,
ex:{task:'Show the <strong>ProductName</strong> and <strong>Price</strong> of every product.',answer:'SELECT ProductName, Price FROM Products;',hint:'Two columns, separated by a comma, from the Products table.'},
quiz:{q:'What does * mean in SELECT * FROM Orders; ?',opts:['The first row only','All columns','The first column only','Only rows that have data'],a:1,exp:'The * means "all columns".'}
},

{id:'distinct', sec:'s1', title:'SELECT DISTINCT: No repeats', short:'SELECT DISTINCT',
body:`
<p>Sometimes a column has repeated values. For example, several customers live in Baguio. <mark>SELECT DISTINCT</mark> shows each value only once.</p>
<pre class="syntax">SELECT DISTINCT column
FROM table_name;</pre>
<h2>See the difference</h2>
<p>Without DISTINCT, every customer's city appears:</p>
<div class="runner">SELECT City FROM Customers;</div>
<p>With DISTINCT, each city appears only once:</p>
<div class="runner">SELECT DISTINCT City FROM Customers;</div>
<h2>Count the distinct values</h2>
<p>Combine COUNT and DISTINCT to find out how many different cities there are.</p>
<div class="runner">SELECT COUNT(DISTINCT City) FROM Customers;</div>
`,
ex:{task:'Show every distinct <strong>Category</strong> in the Products table.',answer:'SELECT DISTINCT Category FROM Products;',hint:'Use SELECT DISTINCT on the Category column.'},
quiz:{q:'There are 10 customers but only 5 different cities. How many rows does SELECT DISTINCT City FROM Customers; return?',opts:['10','5','1','0'],a:1,exp:'One row per distinct city, so 5.'}
},

{id:'where', sec:'s1', title:'WHERE: Filtering data', short:'WHERE',
body:`
<p><mark>WHERE</mark> works like a filter: it only shows the rows that match your condition.</p>
<pre class="syntax">SELECT column1, column2
FROM table_name
WHERE condition;</pre>
<div class="runner">SELECT * FROM Customers WHERE City = 'Baguio';</div>
<h2>Text and numbers</h2>
<p>Text goes inside single quotes. Numbers don't use quotes.</p>
<div class="runner">SELECT ProductName, Price FROM Products WHERE Price > 200;</div>
<h2>Operators you can use</h2>
<div class="tbl-scroll"><table class="info">
<tr><th>Operator</th><th>Meaning</th></tr>
<tr><td>=</td><td>Equal</td></tr>
<tr><td>&lt;&gt; or !=</td><td>Not equal</td></tr>
<tr><td>&gt;</td><td>Greater than</td></tr>
<tr><td>&lt;</td><td>Less than</td></tr>
<tr><td>&gt;=</td><td>Greater than or equal</td></tr>
<tr><td>&lt;=</td><td>Less than or equal</td></tr>
</table></div>
<div class="runner">SELECT Name, City FROM Customers WHERE City &lt;&gt; 'Baguio';</div>
`,
ex:{task:'Show all columns for customers whose <strong>Age</strong> is over 30.',answer:'SELECT * FROM Customers WHERE Age > 30;',hint:'Use WHERE Age > 30.'},
quiz:{q:'Which one is written correctly?',opts:["WHERE City = Cebu","WHERE City = 'Cebu'","WHERE 'City' = Cebu","WHERE City IS Cebu"],a:1,exp:"Text values go inside single quotes: 'Cebu'. Column names don't."}
},

{id:'and-or-not', sec:'s1', title:'AND, OR and NOT', short:'AND, OR, NOT',
body:`
<p>You can combine several conditions in a single WHERE.</p>
<div class="tbl-scroll"><table class="info">
<tr><th>Operator</th><th>Meaning</th></tr>
<tr><td>AND</td><td>All conditions must be true</td></tr>
<tr><td>OR</td><td>At least one condition must be true</td></tr>
<tr><td>NOT</td><td>Reverses a condition</td></tr>
</table></div>
<h2>AND</h2>
<p>Customers from Baguio who are under 30:</p>
<div class="runner">SELECT * FROM Customers WHERE City = 'Baguio' AND Age &lt; 30;</div>
<h2>OR</h2>
<p>Customers from Cebu or Davao:</p>
<div class="runner">SELECT * FROM Customers WHERE City = 'Cebu' OR City = 'Davao';</div>
<h2>NOT</h2>
<div class="runner">SELECT * FROM Customers WHERE NOT City = 'Manila';</div>
<h2>Use parentheses</h2>
<p>When you mix AND and OR, use parentheses to make it clear what is checked first, just like in math.</p>
<div class="runner">SELECT * FROM Products
WHERE Category = 'Food' AND (Price &lt; 160 OR Stock > 60);</div>
`,
ex:{task:'Show all columns for products in the <strong>Drinks</strong> category with a Price below 200.',answer:"SELECT * FROM Products WHERE Category = 'Drinks' AND Price < 200;",hint:"Two conditions joined by AND."},
quiz:{q:"What does WHERE Age > 30 OR City = 'Baguio' return?",opts:['Only Baguio customers over 30','Everyone over 30, plus everyone from Baguio','Nothing','Every customer'],a:1,exp:'With OR, only one of the two conditions needs to be true.'}
},

{id:'order-by', sec:'s1', title:'ORDER BY: Sorting results', short:'ORDER BY',
body:`
<p><mark>ORDER BY</mark> sorts the result by one or more columns.</p>
<pre class="syntax">SELECT column1, column2
FROM table_name
ORDER BY column1 ASC|DESC;</pre>
<div class="tbl-scroll"><table class="info">
<tr><th>Keyword</th><th>Meaning</th></tr>
<tr><td>ASC</td><td>Ascending: small to large, A to Z. This is the default.</td></tr>
<tr><td>DESC</td><td>Descending: large to small, Z to A.</td></tr>
</table></div>
<div class="runner">SELECT ProductName, Price FROM Products ORDER BY Price;</div>
<div class="runner">SELECT ProductName, Price FROM Products ORDER BY Price DESC;</div>
<h2>Alphabetical</h2>
<div class="runner">SELECT Name FROM Customers ORDER BY Name;</div>
<h2>Several columns</h2>
<p>First the rows are sorted by City. When the City is the same, they're sorted by Age, oldest first.</p>
<div class="runner">SELECT Name, City, Age FROM Customers
ORDER BY City ASC, Age DESC;</div>
`,
ex:{task:'Show all columns of Products, sorted from <strong>most expensive</strong> to cheapest.',answer:'SELECT * FROM Products ORDER BY Price DESC;',ordered:true,hint:'Use ORDER BY Price with DESC.'},
quiz:{q:"If you don't write ASC or DESC, how is the result sorted?",opts:['Descending (DESC)','Ascending (ASC)','Randomly','It is not sorted'],a:1,exp:'ASC (ascending) is the default for ORDER BY.'}
},

{id:'limit', sec:'s1', title:'LIMIT: Only a few rows', short:'LIMIT',
body:`
<p><mark>LIMIT</mark> caps the number of rows returned. It's often used with ORDER BY to get a "top 3", "the newest", and so on.</p>
<pre class="syntax">SELECT column1
FROM table_name
LIMIT number;</pre>
<div class="runner">SELECT * FROM Products LIMIT 3;</div>
<h2>Top 3 most expensive</h2>
<div class="runner">SELECT ProductName, Price FROM Products
ORDER BY Price DESC
LIMIT 3;</div>
<h2>Skip rows with OFFSET</h2>
<p>OFFSET skips a number of rows. This is how websites split results into pages: page 1, page 2, and so on.</p>
<div class="runner">SELECT ProductName, Price FROM Products
ORDER BY Price DESC
LIMIT 3 OFFSET 3;</div>
<div class="note"><p><strong>In other databases:</strong> SQL Server uses <code>SELECT TOP 3 ...</code>. Oracle uses <code>FETCH FIRST 3 ROWS ONLY</code>. The idea is the same.</p></div>
`,
ex:{task:'Show all columns of the <strong>two cheapest</strong> products.',answer:'SELECT * FROM Products ORDER BY Price ASC LIMIT 2;',ordered:true,hint:'Sort by Price ascending, then LIMIT 2.'},
quiz:{q:'What does ORDER BY Price DESC LIMIT 1 return?',opts:['The cheapest product','The most expensive product','Every product','The first product added'],a:1,exp:'It sorts from most expensive (DESC), then takes only the first row.'}
},

{id:'aggregate', sec:'s2', title:'COUNT, SUM, AVG, MIN and MAX', short:'COUNT, SUM, AVG, MIN, MAX',
body:`
<p>These are called <mark>aggregate functions</mark>. They take many rows and return a single answer.</p>
<div class="tbl-scroll"><table class="info">
<tr><th>Function</th><th>What it does</th></tr>
<tr><td>COUNT()</td><td>Counts the rows</td></tr>
<tr><td>SUM()</td><td>Adds up the total</td></tr>
<tr><td>AVG()</td><td>Calculates the average</td></tr>
<tr><td>MIN()</td><td>Smallest value</td></tr>
<tr><td>MAX()</td><td>Largest value</td></tr>
</table></div>
<div class="runner">SELECT COUNT(*) FROM Customers;</div>
<div class="runner">SELECT MIN(Price), MAX(Price) FROM Products;</div>
<div class="runner">SELECT SUM(Stock) FROM Products;</div>
<div class="runner">SELECT AVG(Age) FROM Customers;</div>
<h2>With WHERE</h2>
<p>How many customers are from Baguio?</p>
<div class="runner">SELECT COUNT(*) FROM Customers WHERE City = 'Baguio';</div>
<div class="note"><p><strong>Remember:</strong> <code>COUNT(Email)</code> skips rows with no Email (NULL). <code>COUNT(*)</code> counts every row.</p></div>
`,
ex:{task:'Get the <strong>average Price</strong> of all products.',answer:'SELECT AVG(Price) FROM Products;',hint:'Use AVG() on the Price column.'},
quiz:{q:'Which one gives the highest price?',opts:['MIN(Price)','COUNT(Price)','MAX(Price)','SUM(Price)'],a:2,exp:'MAX() returns the largest value.'}
},

{id:'like', sec:'s2', title:'LIKE: Searching for patterns', short:'LIKE',
body:`
<p>Use <mark>LIKE</mark> when you're searching for text that follows a pattern instead of an exact match. There are two special symbols, called wildcards:</p>
<div class="tbl-scroll"><table class="info">
<tr><th>Wildcard</th><th>Meaning</th></tr>
<tr><td>%</td><td>Any number of characters, including none</td></tr>
<tr><td>_</td><td>Exactly one character</td></tr>
</table></div>
<div class="tbl-scroll"><table class="info">
<tr><th>Pattern</th><th>Matches</th></tr>
<tr><td>'M%'</td><td>Starts with M</td></tr>
<tr><td>'%a'</td><td>Ends with a</td></tr>
<tr><td>'%coffee%'</td><td>Contains "coffee" anywhere</td></tr>
<tr><td>'_a%'</td><td>Second letter is a</td></tr>
</table></div>
<div class="runner">SELECT * FROM Customers WHERE Name LIKE 'M%';</div>
<div class="runner">SELECT * FROM Products WHERE ProductName LIKE '%mango%';</div>
<div class="runner">SELECT Name FROM Customers WHERE Name LIKE '_a%';</div>
<div class="note"><p>In SQLite, LIKE is not case-sensitive for the letters A to Z, so 'mango' matches "Mangoes". Other databases may behave differently.</p></div>
`,
ex:{task:'Show all columns for customers whose Email ends with <strong>@gmail.com</strong>.',answer:"SELECT * FROM Customers WHERE Email LIKE '%@gmail.com';",hint:"Put % in front of '@gmail.com'."},
quiz:{q:"Which name matches WHERE Name LIKE 'J%' ?",opts:['Maria Santos','Juan dela Cruz','Ana Bautista','Rosa Villanueva'],a:1,exp:'J% matches anything that starts with the letter J.'}
},

{id:'in-between', sec:'s2', title:'IN and BETWEEN', short:'IN, BETWEEN',
body:`
<h2>IN: One of a list</h2>
<p><mark>IN</mark> is a shorter way to write many ORs.</p>
<pre class="syntax">WHERE column IN (value1, value2, value3)</pre>
<div class="runner">SELECT * FROM Customers WHERE City IN ('Cebu', 'Davao', 'Iloilo');</div>
<p>You can reverse it with NOT IN:</p>
<div class="runner">SELECT * FROM Customers WHERE City NOT IN ('Baguio', 'Manila');</div>
<h2>BETWEEN: Within a range</h2>
<p><mark>BETWEEN</mark> is for values inside a range. Both ends of the range are included.</p>
<pre class="syntax">WHERE column BETWEEN start AND end</pre>
<div class="runner">SELECT ProductName, Price FROM Products WHERE Price BETWEEN 150 AND 250;</div>
<p>It works with dates too:</p>
<div class="runner">SELECT * FROM Orders WHERE OrderDate BETWEEN '2026-02-01' AND '2026-02-28';</div>
`,
ex:{task:'Show all columns for customers from <strong>Baguio</strong> or <strong>Iloilo</strong>, using IN.',answer:"SELECT * FROM Customers WHERE City IN ('Baguio', 'Iloilo');",hint:"WHERE City IN ('...', '...')"},
quiz:{q:'Is a product priced at 200 included in WHERE Price BETWEEN 100 AND 200 ?',opts:['Yes, the end is included','No, the end is excluded','It depends on ORDER BY','It causes an error'],a:0,exp:'BETWEEN includes both the start and the end of the range.'}
},

{id:'null', sec:'s2', title:'NULL: Missing values', short:'NULL',
body:`
<p><mark>NULL</mark> means there is no value. It's not the same as 0 or empty text <code>''</code>. For example, some customers didn't give an Email.</p>
<p>You can't use <code>=</code> with NULL. Use <strong>IS NULL</strong> or <strong>IS NOT NULL</strong>.</p>
<div class="runner">SELECT * FROM Customers WHERE Email IS NULL;</div>
<div class="runner">SELECT Name, Email FROM Customers WHERE Email IS NOT NULL;</div>
<div class="warn"><p><strong>Common mistake:</strong> try the query below. Nothing comes back, even though some customers have no Email, because <code>= NULL</code> doesn't work.</p></div>
<div class="runner">SELECT * FROM Customers WHERE Email = NULL;</div>
<h2>Replace NULL with a default</h2>
<p><code>COALESCE</code> returns the first value that isn't NULL.</p>
<div class="runner">SELECT Name, COALESCE(Email, 'no email') AS Email FROM Customers;</div>
`,
ex:{task:'Show all columns for customers with <strong>no Email</strong>.',answer:'SELECT * FROM Customers WHERE Email IS NULL;',hint:'Use IS NULL, not = NULL.'},
quiz:{q:'What is the right way to find rows with no Email?',opts:['WHERE Email = NULL',"WHERE Email = ''",'WHERE Email IS NULL','WHERE Email = 0'],a:2,exp:'Always use IS NULL or IS NOT NULL with NULL.'}
},

{id:'alias', sec:'s2', title:'AS: Naming columns and tables', short:'Aliases (AS)',
body:`
<p><mark>AS</mark> gives a temporary name, or alias, to a column or table. It makes results easier to read.</p>
<div class="runner">SELECT ProductName AS Product, Price AS Cost FROM Products;</div>
<div class="runner">SELECT COUNT(*) AS TotalCustomers FROM Customers;</div>
<h2>Names with spaces</h2>
<p>Use double quotes.</p>
<div class="runner">SELECT Name AS "Full Name" FROM Customers;</div>
<h2>Calculations</h2>
<p>You can create a new column from a calculation and give it a name.</p>
<div class="runner">SELECT ProductName, Price, Stock, Price * Stock AS TotalValue
FROM Products;</div>
<h2>Table aliases</h2>
<p>These shorten your queries, especially with JOIN, which you'll learn next.</p>
<div class="runner">SELECT c.Name, c.City FROM Customers AS c;</div>
`,
ex:{task:'Show the ProductName and the <strong>Price with a 10% discount</strong> (Price * 0.9) for each product. Name the new column <strong>Discounted</strong>.',answer:'SELECT ProductName, Price * 0.9 AS Discounted FROM Products;',hint:'SELECT ProductName, Price * 0.9 AS ... FROM Products;'},
quiz:{q:"Does AS change the column's real name in the database?",opts:['Yes, permanently','No, only in the query result','Yes, but only in the table','No, it causes an error'],a:1,exp:'An alias is temporary. It only applies to the result of that query.'}
},

{id:'join', sec:'s3', title:'JOIN: Combining tables', short:'JOIN',
body:`
<p>Data is usually split across several tables to avoid repeating it. For example, Orders only stores the <code>CustomerID</code>, not the customer's name. To see them together, use <mark>JOIN</mark>.</p>
<div class="joinviz">
<div class="jt"><b>Orders</b><span>OrderID</span><span class="k">CustomerID</span><span>ProductID</span></div>
<div class="jarrow">matching<br>CustomerID</div>
<div class="jt"><b>Customers</b><span class="k">CustomerID</span><span>Name</span><span>City</span></div>
</div>
<h2>INNER JOIN</h2>
<p>Returns only rows that have a match in both tables.</p>
<pre class="syntax">SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;</pre>
<div class="runner">SELECT Orders.OrderID, Customers.Name, Orders.OrderDate
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;</div>
<h2>Three tables</h2>
<p>Use aliases (o, c, p) to keep it short.</p>
<div class="runner">SELECT o.OrderID, c.Name, p.ProductName, o.Quantity
FROM Orders AS o
JOIN Customers AS c ON o.CustomerID = c.CustomerID
JOIN Products AS p ON o.ProductID = p.ProductID;</div>
<h2>LEFT JOIN</h2>
<p>Returns every row from the left table, even without a match on the right. Missing matches become NULL.</p>
<div class="runner">SELECT c.Name, o.OrderID
FROM Customers AS c
LEFT JOIN Orders AS o ON c.CustomerID = o.CustomerID;</div>
<p>You'll see that Ana, Carlo and Grace have no orders, so their OrderID is NULL.</p>
<div class="tbl-scroll"><table class="info">
<tr><th>Type</th><th>Returns</th></tr>
<tr><td>INNER JOIN</td><td>Rows with a match in both tables</td></tr>
<tr><td>LEFT JOIN</td><td>Everything on the left, plus matches on the right</td></tr>
<tr><td>RIGHT JOIN</td><td>Everything on the right, plus matches on the left</td></tr>
<tr><td>FULL JOIN</td><td>Every row from both tables</td></tr>
</table></div>
`,
ex:{task:'Show the <strong>OrderID</strong>, <strong>ProductName</strong> and <strong>Quantity</strong> of every order.',answer:'SELECT Orders.OrderID, Products.ProductName, Orders.Quantity FROM Orders INNER JOIN Products ON Orders.ProductID = Products.ProductID;',hint:'JOIN Orders and Products on ProductID.'},
quiz:{q:'Which JOIN shows EVERY customer, including those with no orders yet?',opts:['INNER JOIN','LEFT JOIN (Customers on the left)','There is no such JOIN','ORDER BY'],a:1,exp:'LEFT JOIN returns every row from the left table, even without a match.'}
},

{id:'group-by', sec:'s3', title:'GROUP BY: Grouping rows', short:'GROUP BY',
body:`
<p><mark>GROUP BY</mark> groups rows that share the same value, so you can use COUNT, SUM, AVG and others on each group.</p>
<pre class="syntax">SELECT column, AGGREGATE(column)
FROM table_name
GROUP BY column;</pre>
<p>How many customers are in each city?</p>
<div class="runner">SELECT City, COUNT(*) AS Total
FROM Customers
GROUP BY City;</div>
<p>Average price per category:</p>
<div class="runner">SELECT Category, AVG(Price) AS AveragePrice
FROM Products
GROUP BY Category;</div>
<h2>With JOIN</h2>
<p>How much has each customer spent in total?</p>
<div class="runner">SELECT c.Name, SUM(o.Quantity * p.Price) AS TotalSpent
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID
JOIN Products p ON o.ProductID = p.ProductID
GROUP BY c.Name
ORDER BY TotalSpent DESC;</div>
<div class="note"><p><strong>Rule:</strong> any column in SELECT that isn't inside an aggregate function must also appear in GROUP BY.</p></div>
`,
ex:{task:'Count <strong>how many products</strong> are in each Category. Show the Category and the count.',answer:'SELECT Category, COUNT(*) FROM Products GROUP BY Category;',hint:'SELECT Category, COUNT(*) ... GROUP BY Category'},
quiz:{q:'What does GROUP BY City do?',opts:['Sorts the result by City','Groups rows that have the same City','Deletes repeated cities','Shows the first City'],a:1,exp:'It groups rows together. It is usually used with COUNT, SUM, AVG and similar functions.'}
},

{id:'having', sec:'s3', title:'HAVING: Filtering groups', short:'HAVING',
body:`
<p>You can't use WHERE on the result of an aggregate function. For that, use <mark>HAVING</mark>.</p>
<div class="tbl-scroll"><table class="info">
<tr><th>Clause</th><th>When it filters</th></tr>
<tr><td>WHERE</td><td>Filters rows before grouping</td></tr>
<tr><td>HAVING</td><td>Filters groups after grouping</td></tr>
</table></div>
<p>Cities with more than one customer:</p>
<div class="runner">SELECT City, COUNT(*) AS Total
FROM Customers
GROUP BY City
HAVING COUNT(*) > 1;</div>
<p>Categories with an average price above 200:</p>
<div class="runner">SELECT Category, AVG(Price) AS AveragePrice
FROM Products
GROUP BY Category
HAVING AVG(Price) > 200;</div>
<h2>The correct order</h2>
<pre class="syntax">SELECT ...
FROM ...
WHERE ...
GROUP BY ...
HAVING ...
ORDER BY ...
LIMIT ...;</pre>
`,
ex:{task:'Show the categories whose total <strong>Stock</strong> (SUM) is more than 100. Show the Category and the total Stock.',answer:'SELECT Category, SUM(Stock) FROM Products GROUP BY Category HAVING SUM(Stock) > 100;',hint:'GROUP BY Category, then HAVING SUM(Stock) > 100.'},
quiz:{q:'Which one is correct?',opts:['WHERE COUNT(*) > 1','HAVING COUNT(*) > 1 after GROUP BY','GROUP BY COUNT(*) > 1','ORDER BY COUNT(*) > 1'],a:1,exp:'Conditions on aggregate functions go in HAVING, after GROUP BY.'}
},

{id:'insert', sec:'s4', title:'INSERT INTO: Adding data', short:'INSERT INTO',
body:`
<p><mark>INSERT INTO</mark> adds a new row to a table.</p>
<pre class="syntax">INSERT INTO table_name (column1, column2, column3)
VALUES (value1, value2, value3);</pre>
<div class="runner">INSERT INTO Customers (Name, City, Age, Email)
VALUES ('Nena Cruz', 'Baguio', 27, 'nena@gmail.com');</div>
<p>Check that it was added:</p>
<div class="runner">SELECT * FROM Customers;</div>
<div class="note"><p><strong>Why no CustomerID?</strong> CustomerID is a PRIMARY KEY, so the database fills in the next number automatically.</p></div>
<h2>Several rows at once</h2>
<div class="runner">INSERT INTO Products (ProductName, Category, Price, Stock)
VALUES ('Sagada Orange', 'Food', 120, 35),
       ('Buko Pie', 'Food', 280, 12);</div>
<div class="runner">SELECT * FROM Products;</div>
<div class="note"><p>Made a mistake? Press <strong>Reset data</strong> above any editor to restore the original database.</p></div>
`,
quiz:{q:"What happens if the number of values doesn't match the number of columns in an INSERT?",opts:['An error occurs','It is added anyway','The table is deleted','The database fixes it'],a:0,exp:'The number of columns and values must match, otherwise you get an error.'}
},

{id:'update', sec:'s4', title:'UPDATE: Changing data', short:'UPDATE',
body:`
<p><mark>UPDATE</mark> changes the contents of existing rows.</p>
<pre class="syntax">UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;</pre>
<div class="warn"><p><strong>Careful:</strong> always include a WHERE. Without it, <strong>every</strong> row in the table is changed.</p></div>
<div class="runner">UPDATE Products SET Price = 270 WHERE ProductName = 'Barako Coffee';</div>
<div class="runner">SELECT * FROM Products WHERE ProductName = 'Barako Coffee';</div>
<h2>Several columns at once</h2>
<div class="runner">UPDATE Customers SET City = 'La Trinidad', Age = 35 WHERE CustomerID = 1;</div>
<h2>Based on the current value</h2>
<p>Add 10 to the Stock of every drink:</p>
<div class="runner">UPDATE Products SET Stock = Stock + 10 WHERE Category = 'Drinks';</div>
<div class="runner">SELECT ProductName, Category, Stock FROM Products;</div>
<div class="note"><p><strong>Good habit:</strong> before an UPDATE, run a SELECT with the same WHERE to see which rows will change.</p></div>
`,
quiz:{q:'What happens with UPDATE Products SET Price = 0; ?',opts:['Nothing','EVERY product price becomes 0','Only the first product becomes 0','An error occurs'],a:1,exp:'Without WHERE, every row is changed.'}
},

{id:'delete', sec:'s4', title:'DELETE: Removing data', short:'DELETE',
body:`
<p><mark>DELETE</mark> removes rows from a table.</p>
<pre class="syntax">DELETE FROM table_name
WHERE condition;</pre>
<div class="warn"><p><strong>Careful:</strong> like UPDATE, always include a WHERE. <code>DELETE FROM Orders;</code> deletes every order.</p></div>
<div class="runner">DELETE FROM Orders WHERE OrderID = 12;</div>
<div class="runner">SELECT * FROM Orders;</div>
<h2>Several rows at once</h2>
<div class="runner">DELETE FROM Orders WHERE OrderDate &lt; '2026-01-10';</div>
<div class="note"><p>In a real database, DELETE has no "undo". Here on SQDhell you can press <strong>Reset data</strong> to restore everything.</p></div>
`,
quiz:{q:"What does DELETE FROM Customers WHERE City = 'Cebu'; remove?",opts:['The whole Customers table','The City column','Only the customers from Cebu','Nothing'],a:2,exp:'It only removes the rows that match the WHERE.'}
},

{id:'create-table', sec:'s5', title:'CREATE TABLE: Making a table', short:'CREATE TABLE',
body:`
<p><mark>CREATE TABLE</mark> makes a new table. You define its columns and what type of data each one holds.</p>
<pre class="syntax">CREATE TABLE table_name (
  column1 datatype constraint,
  column2 datatype constraint
);</pre>
<h2>Data types</h2>
<div class="tbl-scroll"><table class="info">
<tr><th>Type</th><th>For</th></tr>
<tr><td>INTEGER</td><td>Whole numbers: 1, 25, 300</td></tr>
<tr><td>REAL</td><td>Numbers with decimals: 99.50</td></tr>
<tr><td>TEXT</td><td>Words or sentences</td></tr>
<tr><td>DATE</td><td>Dates. In SQLite, written as text like 'YYYY-MM-DD'</td></tr>
</table></div>
<h2>Constraints</h2>
<div class="tbl-scroll"><table class="info">
<tr><th>Constraint</th><th>Meaning</th></tr>
<tr><td>PRIMARY KEY</td><td>A unique ID for each row</td></tr>
<tr><td>NOT NULL</td><td>Can't be empty</td></tr>
<tr><td>UNIQUE</td><td>No duplicate values allowed</td></tr>
<tr><td>DEFAULT</td><td>Value used when none is given</td></tr>
<tr><td>CHECK</td><td>Must pass a condition</td></tr>
<tr><td>FOREIGN KEY</td><td>Points to the PRIMARY KEY of another table</td></tr>
</table></div>
<div class="runner">CREATE TABLE Employees (
  EmployeeID INTEGER PRIMARY KEY,
  Name TEXT NOT NULL,
  Position TEXT,
  Salary REAL CHECK (Salary > 0),
  Email TEXT UNIQUE,
  HireDate TEXT DEFAULT '2026-01-01'
);</div>
<p>Add an employee and look at the result:</p>
<div class="runner">INSERT INTO Employees (Name, Position, Salary, Email)
VALUES ('Tessa Lim', 'Cashier', 18000, 'tessa@sqlaro.ph');

SELECT * FROM Employees;</div>
<h2>Try breaking a rule</h2>
<p>This employee has no Name, so the database rejects it because of NOT NULL:</p>
<div class="runner">INSERT INTO Employees (Position, Salary) VALUES ('Guard', 15000);</div>
`,
quiz:{q:'Which constraint stops two employees from having the same Email?',opts:['NOT NULL','DEFAULT','UNIQUE','CHECK'],a:2,exp:'UNIQUE forbids duplicate values in a column.'}
},

{id:'alter-drop', sec:'s5', title:'ALTER TABLE and DROP TABLE', short:'ALTER, DROP',
body:`
<h2>ALTER TABLE: Change a table</h2>
<p><mark>ALTER TABLE</mark> adds, renames, or removes columns in an existing table.</p>
<p>Add a column:</p>
<div class="runner">ALTER TABLE Customers ADD Phone TEXT;

SELECT * FROM Customers;</div>
<p>Rename a column:</p>
<div class="runner">ALTER TABLE Customers RENAME COLUMN Phone TO Mobile;</div>
<p>Remove a column:</p>
<div class="runner">ALTER TABLE Customers DROP COLUMN Mobile;</div>
<h2>DROP TABLE: Delete the whole table</h2>
<p><mark>DROP TABLE</mark> deletes an entire table, including all its data.</p>
<div class="runner">CREATE TABLE Temp (id INTEGER);

DROP TABLE Temp;</div>
<p>Use <code>IF EXISTS</code> to avoid an error when the table isn't there:</p>
<div class="runner">DROP TABLE IF EXISTS Temp;</div>
<div class="warn"><p><strong>Careful:</strong> in a real database, a dropped table can't be recovered. Make sure you have a backup.</p></div>
<div class="note"><p><strong>Congratulations!</strong> You've finished every lesson. Put your skills to work in the <a href="#/playground">Playground</a>, or review everything in the <a href="#/reference">Quick reference</a>.</p></div>
`,
quiz:{q:'What is the difference between DELETE FROM Customers; and DROP TABLE Customers; ?',opts:['They are the same','DELETE removes the rows but keeps the table; DROP removes the whole table','DROP removes only the rows','DELETE is for columns'],a:1,exp:'After DELETE the table is empty but still exists. After DROP, the table itself is gone.'}
}
];

const CHEAT = [
 {title:'Getting data', rows:[
  ['SELECT','SELECT Name, City FROM Customers;','Get specific columns','select'],
  ['SELECT *','SELECT * FROM Products;','Get every column','select'],
  ['DISTINCT','SELECT DISTINCT City FROM Customers;','No repeated values','distinct'],
  ['WHERE',"SELECT * FROM Customers WHERE City = 'Baguio';",'Filter rows','where'],
  ['AND / OR / NOT',"WHERE City = 'Cebu' AND Age > 30",'Combine conditions','and-or-not'],
  ['ORDER BY','SELECT * FROM Products ORDER BY Price DESC;','Sort the result','order-by'],
  ['LIMIT','SELECT * FROM Products LIMIT 5;','Only a few rows','limit']
 ]},
 {title:'Filtering and counting', rows:[
  ['COUNT / SUM / AVG','SELECT COUNT(*), AVG(Price) FROM Products;','Count, total, average','aggregate'],
  ['MIN / MAX','SELECT MIN(Price), MAX(Price) FROM Products;','Smallest, largest','aggregate'],
  ['LIKE',"WHERE Name LIKE 'M%'",'Pattern search','like'],
  ['IN',"WHERE City IN ('Cebu', 'Davao')",'One of a list','in-between'],
  ['BETWEEN','WHERE Price BETWEEN 100 AND 200','Within a range, ends included','in-between'],
  ['IS NULL','WHERE Email IS NULL','Missing value','null'],
  ['AS','SELECT Price AS Cost FROM Products;','Alias','alias']
 ]},
 {title:'Combining tables', rows:[
  ['INNER JOIN','FROM Orders o JOIN Customers c\n  ON o.CustomerID = c.CustomerID','Rows with a match','join'],
  ['LEFT JOIN','FROM Customers c LEFT JOIN Orders o\n  ON c.CustomerID = o.CustomerID','Everything on the left','join'],
  ['GROUP BY','SELECT City, COUNT(*) FROM Customers\nGROUP BY City;','Group rows','group-by'],
  ['HAVING','GROUP BY City HAVING COUNT(*) > 1','Filter groups','having']
 ]},
 {title:'Changing data and tables', rows:[
  ['INSERT INTO',"INSERT INTO Customers (Name, City)\nVALUES ('Nena', 'Baguio');",'Add a row','insert'],
  ['UPDATE',"UPDATE Products SET Price = 270\nWHERE ProductID = 1;",'Change a row','update'],
  ['DELETE','DELETE FROM Orders WHERE OrderID = 12;','Remove a row','delete'],
  ['CREATE TABLE','CREATE TABLE Pets (id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL);','Make a table','create-table'],
  ['ALTER TABLE','ALTER TABLE Customers ADD Phone TEXT;','Change a table','alter-drop'],
  ['DROP TABLE','DROP TABLE IF EXISTS Pets;','Delete a whole table','alter-drop']
 ]}
];
