import mysql.connector as connector
from mysql.connector import Error

VALID_QUERIES = [1,2,3,4,5,6,7,8,9,10]

# Cria a conexão com as credenciais locais
def createConnection():
    return connector.connect(
        user='root', 
        password='Eternia213@', 
        database='trabalho_fbd', 
        host='127.0.0.1',
        port=3306,
        charset='utf8',
        use_unicode=True)

def printMenu():
    print("#------------------------------------- MENU ----------------------------------------------#")
    print("1  = Number of books written by an author, total count of genres and the average rating")
    print("2  = Number of books owned per user, their best, worst and average rating")
    print("3  = Authors who wrote at least 2 distinct genres")
    print("4  = Users that never entered copies of brazilian books in their libraries")
    print("5  = Brazilian books given as courtesy to users who live in the state of Rio Grande do Sul")
    print("6  = Brazilian books marked as favorite by underage users")
    print("7  = Number of comments published by users who are in the same groups as a given user")
    print("8  = Friends of a given user who participated of the same prize draws as them")
    print("9  = Series whose books have and average rating above a certain value")
    print("10 = Readers ordered by who read the most suspense books to who read the least")
    print("------------------------------------------------------------------------------------------")

def main():
    try:
        # cria a conexão com o banco
        connection = createConnection()

        # o cursor é o objeto que executa as queries no banco e retorna o resultado
        cursor = connection.cursor()
    
        # Loop principal de execução
        exit = False
        while(not exit):
            # MENU
            printMenu()
            try:
                query = int(input("Execute query with ID: "))

                if query in VALID_QUERIES:
                    executeQueryByNumber(cursor, query)
                else:
                    print("Please, inform a valid query ID.")

                option = input("Consult again? (Y/N) ")
                if option == 'n' or option == 'N':
                    exit = True 

            except Error as e:
                print("Error: ", e)           

        cursor.close()
        connection.close()
        print("Database connection is closed")
        return                        
        
    except Error as e:
        print("Error while connecting to database...", e)        

# dado um número de query, verifica se precisa passar algum parâmetro pra executar essa query
def executeQueryByNumber(cursor, query):
    if query in [1,7,8,9]:
        parameter = input("Especific parameter for this query: ")
        if parameter != '':
            executeQuery(cursor, query, parameter)
        else:
            print("You must inform a parameter!")
    else:
        executeQuery(cursor, query)

# monta a query e a executa
def executeQuery(cursor, queryId, parameter=''):
    try:
        if queryId == 1:
            query = """SELECT 
                            COUNT(writing.isbn13) AS booksWritten, 
                            COUNT(distinct genrename) AS genreCount, 
                            AVG(rating) AS averageRating
                        FROM 
                            writing NATURAL JOIN 
                            book JOIN 
                            classification ON (book.isbn13 = classification.isbn13)
                        GROUP BY writername
                        HAVING writername = '{}' """
            query = query.format(parameter)
            cursor.execute(query)
        elif queryId == 2:
            query = """SELECT 
                            COUNT(isbn13) booksOwned, 
                            MAX(rating) AS bestRating, 
                            MIN(rating) AS worstRating, 
                            AVG(rating) AS averageRating
                        FROM 
                            tcopy NATURAL JOIN 
                            book  NATURAL JOIN 
                            tuser
                        GROUP BY username """
            cursor.execute(query)
        elif queryId == 3:
            query = """SELECT DISTINCT writername
                        FROM 
                            writing w NATURAL JOIN 
                            writer JOIN 
                            book ON (book.isbn13 = w.isbn13) JOIN
                            classification ON (classification.isbn13 = w.isbn13) 
                        WHERE genrename <> ANY (
                                SELECT genrename
                                FROM 
                                    writing NATURAL JOIN 
                                    writer JOIN 
                                    book ON (book.isbn13 = writing.isbn13) JOIN
                                    classification ON (classification.isbn13 = writing.isbn13)
                                WHERE writername = w.writername) """
            cursor.execute(query)
        elif queryId == 4:
            query = """SELECT DISTINCT username
                        FROM tuser tu
                        WHERE NOT EXISTS (
                            SELECT NULL
                            FROM
                                tuser NATURAL JOIN 
                                tcopy NATURAL JOIN
                                book JOIN
                                brazilianbooks ON (brazilianbooks.title = book.title)
                                WHERE username = tu.username) """
            cursor.execute(query)
        elif queryId == 5:
            query = """SELECT DISTINCT brazilianbooks.title
                        FROM
                            courtesy NATURAL JOIN
                            book NATURAL JOIN 
                            participation JOIN
                            brazilianbooks ON (brazilianbooks.title = book.title) JOIN 
                            tuser ON (tuser.cpf = participation.cpf)
                        WHERE tuser.userstate = 'rs' """
            cursor.execute(query)
        elif queryId == 6:
            query = """SELECT DISTINCT title
                        FROM  book B
                        WHERE isbn13 = ANY (
                            SELECT isbn13
                            FROM 
                                tcopy NATURAL JOIN 
                                book NATURAL JOIN
                                tuser
                            WHERE 
                                isbn13 = B.isbn13 AND
                                tcopy.favorite = TRUE AND
                                tuser.age < 18) """
            cursor.execute(query)
        elif queryId == 7:
            query = """SELECT 
                            username, 
                            COUNT(commentcode) AS commentCount
                        FROM 
                            tcomment NATURAL JOIN 
                            tuser tu
                        WHERE cpf IN (
                        SELECT cpf
                        FROM 
                            membership NATURAL JOIN 
                            tuser JOIN
                            tgroup ON (tgroup.groupname = membership.groupname)
                        WHERE tgroup.groupname IN (
                            SELECT groupname
                            FROM membership NATURAL JOIN tuser
                            WHERE username = '{}')
                        )
                        GROUP BY tu.username
                        HAVING tu.username <> '{}' """
            query = query.format(parameter, parameter)
            cursor.execute(query)
        elif queryId == 8:
            query = """SELECT DISTINCT username
                        FROM tuser
                        WHERE cpf IN (
                            SELECT cpf_follower
                            FROM
                                friendship JOIN
                                tuser ON (tuser.cpf = cpf_followed)
                            WHERE username = '{}')
                            AND
                            cpf IN (
                            SELECT cpf
                            FROM participation NATURAL JOIN tuser
                            WHERE participation.courtesycode IN (
                                SELECT courtesycode
                                FROM courtesy NATURAL JOIN tuser
                                WHERE username = '{}')) """
            query = query.format(parameter, parameter)
            cursor.execute(query)
        elif queryId == 9:
            query = """SELECT seriesname
                        FROM
                            series NATURAL JOIN
                            booksequence NATURAL JOIN
                            book
                        GROUP BY seriesname
                        HAVING AVG(rating) > {} """
            query = query.format(parameter)
            cursor.execute(query)
        elif queryId == 10:
            query = """SELECT 
                            username, 
                            COUNT(copyCode) readCount
                        FROM 
                            tcopy NATURAL JOIN 
                            tuser NATURAL JOIN 
                            book NATURAL JOIN 
                            classification 
                        WHERE genrename = 'suspense'
                        GROUP BY username
                        ORDER BY readCount DESC """
            cursor.execute(query)

        result = cursor.fetchall()
        
        for row in result:
            for column in row:
                print(str(column) + '     ')
    
    except Error as e:
        print("Error in query execution: ", e)
        
if __name__ == "__main__":
    main()