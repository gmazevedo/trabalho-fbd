
async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
    const mysql= require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://dotnetfdb:dotnet123@localhost:3306/sofascore");
    console.log("conectou mysql");
    global.connection = connection;
    return connection;
}

//connect();

async function selectClubes(){
    const conn = await connect();
    const [rows] = await conn.query("SELECT * from Clube");
    return rows
}

async function insertClube(clube){
    const conn = await connect();
    const sql = "INSERT INTO Clube(id_clube,nome,id_pais,ano_fundacao) values (?,?,?,?);";
    const values = [clube.id_clube,clube.nome,clube.id_pais,clube.ano_fundacao];
    await conn.query(sql, values);

}

async function UpdateClube(clube){
    const conn = await connect();
    const sql = "UPDATE Clube SET nome=?, id_pais=?, ano_fundacao=? WHERE id_clube=?;";
    const values = [clube.nome,clube.id_pais,clube.ano_fundacao, clube.id_clube];
    return await conn.query(sql,values);
}

async function DeleteClube(id_clube){
    const conn = await connect();
    const sql = "DELETE FROM Clube where id_clube=?"
    return await conn.query(sql,[id_clube]);
}

// Pais
async function insertPais(Pais){
    const conn = await connect();
    const sql = "Insert into Pais(id_pais,Nome) VALUES (?,?);";
    const values = [Pais.id_pais,Pais.nome];
    await conn.query(sql, values);

}

async function UpdatePais(Pais){
    const conn = await connect();
    const sql = "UPDATE Clube SET id_pais=?, nome=? WHERE id_pais=?;";
    const values = [Pais.id_pais,Pais.nome, Pais.id_pais];
    return await conn.query(sql,values);
}

async function DeletePais(id_pais){
    const conn = await connect();
    const sql = "DELETE FROM Pais where id_pais=?"
    return await conn.query(sql,[id_pais]);
}

//Arbitro
async function insertArbitro(Arbitro){
    const conn = await connect();
    const sql = "Insert into Arbitro(id_arbitro,Nome, idade) VALUES (?,?,?);";
    const values = [Pais.id_pais,Pais.nome];
    await conn.query(sql, values);

}

async function UpdateArbitro(Arbitro){
    const conn = await connect();
    const sql = "UPDATE Clube SET id_arbitro=?, nome=?, idade=? WHERE id_pais=?;";
    const values = [Arbitro.id_arbitro,Arbitro.nome, Arbitro.idade, Arbitro.id_pais];
    return await conn.query(sql,values);
}

async function DeleteArbitro(id_Arbitro){
    const conn = await connect();
    const sql = "DELETE FROM Pais where id_arbitro=?"
    return await conn.query(sql,[id_Arbitro]);
}

function object_keys(objects){
    var object_array = [];
    var entrada;
    for(var object in objects){
        entrada = {};
        for(var key in objects[object]){
            entrada[key]=objects[object][key]
        }
        object_array.push(entrada);
    }
    return object_array;
}

// CONSULTAS
async function ConsultaEstadiosPorPais()
{
    const conn = await connect();
    const sql = `Select count(*), P.nome
    from Estadio E join Clube C on E.id_clube = C.id_clube
                    join pais P on C.id_pais = P.id_pais
    group by P.nome;`;
    const values = [altura];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Estatisticas_goleiros(altura = '170')
{
    const conn = await connect();
    const sql = `select J.nome, J.altura, C.nome as clube,avg(EG.nro_defesas) as Defesas, avg(EG.nro_lançamentos) as Lançamentos, avg(EG.nro_gols_sofridos) as gols_sofridos
    from estatisticas_gol EG  join goleiro G on EG.tem_gol = G.id_goleiro
                        join Jogador J on G.id_jogador = J.id_jogador
                        join equipe EQ on EQ.id_equipe = J.participa
                        join Clube C on EQ.id_clube = C.id_clube
    group by J.nome
    having J.altura > ?;
    `;
    const values = [altura];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Clube_historico()
{
    const conn = await connect();
    const sql = `select clube, SUM(Vitorias) as Vitorias, SUM(Empates)  as Empates, SUM(Derrotas) as Derrotas
    from(
        select Mandante as clube, SUM(IF (PR.gols_visitante < PR.gols_mandante, 1, 0)) as Vitorias, SUM(IF( PR.gols_visitante = PR.gols_mandante, 1, 0)) as Empates, SUM( IF( PR.gols_visitante > PR.gols_mandante, 1, 0)) as Derrotas
        from Partidas_resultados PR
        group by Mandante
        union
        select visitante as clube, SUM(IF (PR.gols_visitante > PR.gols_mandante, 1, 0)) as Vitorias, SUM(IF( PR.gols_visitante = PR.gols_mandante, 1, 0)) as Empates, SUM( IF( PR.gols_visitante < PR.gols_mandante, 1, 0)) as Derrotas
        from Partidas_resultados PR
        group by visitante) as Temp
    group by clube;`;
    const values = [];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Vencedores_Partidas()
{
    const conn = await connect();
    const sql = `select id_partida, IF(gols_mandante>gols_visitante, Mandante, if(gols_mandante<gols_visitante, Visitante, NULL)) as Vencedor
    from Partidas_resultados
    where gols_mandante != gols_visitante;
    `;
    const values = [];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Perdedores_Partidas(time = 'Inter')
{
    const conn = await connect();
    const sql = `select id_partida, IF(gols_mandante<gols_visitante, Mandante, if(gols_mandante>gols_visitante, Visitante, NULL)) as Perdedor
    from Partidas_resultados
    where gols_mandante != gols_visitante and 
        IF(gols_mandante>gols_visitante, Mandante, if(gols_mandante<gols_visitante, Visitante, NULL)) = ?;`;
    const values = [time];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Arbitros_Partidas()
{
    const conn = await connect();
    const sql = `select arbitro, count(distinct clube) as nro_clubes_diferentes
    from (            
        select A.nome as arbitro, C1.nome as clube
        from arbitro A join Partida P on P.id_arbitro = A.id_arbitro
                    join Disputa D on P.id_visitante = D.id_disputa
                    join equipe E on D.id_equipe = E.id_equipe
                    join clube C1 on E.id_clube = C1.id_clube
        union
        select A.nome, C.nome
        from arbitro A join Partida P on P.id_arbitro = A.id_arbitro
                    join Disputa D on P.id_mandante = D.id_disputa
                    join equipe E on D.id_equipe = E.id_equipe
                    join Clube C on E.id_clube = C.id_clube
    ) as clube_arbitro
    group by arbitro;`;
    const values = [];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Estatisticas_Vencedores()
{
    const conn = await connect();
    const sql = `select P.id_partida,C.nome as Vencedor, J.nome
    from Partida P natural join estatisticas_linha
                    natural join Linha L
                    natural join Jogador J
                    join equipe E on E.id_equipe = J.participa
                    join Clube C on E.id_clube = C.id_clube
                    where (id_partida, C.nome) 
                             in (select id_partida, IF(gols_mandante>gols_visitante, Mandante, if(gols_mandante<gols_visitante, Visitante, NULL)) as Vencedor
                                    from Partidas_resultados
                                    where gols_mandante != gols_visitante);
        
        select visitante as clube, SUM(IF (PR.gols_visitante > PR.gols_mandante, 1, 0)) as Vitorias, SUM(IF( PR.gols_visitante = PR.gols_mandante, 1, 0)) as Empates, SUM( IF( PR.gols_visitante < PR.gols_mandante, 1, 0)) as Derrotas
        from Partidas_resultados PR
        group by visitante;`;
    const values = [];
    const [rows] = await conn.query(sql, values);
    return object_keys(rows);
}

async function Consulta_Tecnicos_estrangeiros()
{
  const conn = await connect();
  const sql = `select count(*) as tecnicos_estrangeiros
  from tecnico T join contrato_tec CT on T.id_tecnico = CT.id_tecnico
          join Clube C on CT.id_clube = C.id_clube
  where T.origem_tec != C.id_pais;`;
  const values = [];
  const [rows] = await conn.query(sql, values);
  return object_keys(rows);
}


async function Consulta_MaisVitorias_Campeonato()
{
  const conn = await connect();
  const sql = `select campeonato, clube, max(nro_vitorias)
  from (			
  select  CA.nome as campeonato, IF(gols_mandante>gols_visitante, C2.nome, IF(gols_visitante>gols_mandante, C1.nome,null)) as clube, count(*) as nro_vitorias
  from Partida P join Disputa D on P.id_visitante = D.id_disputa
              natural join equipe E
              natural join Clube C1
              join Disputa D1 on P.id_mandante = D1.id_disputa
              join equipe E2 on D1.id_equipe = E2.id_equipe
              join Clube C2 on E2.id_clube = C2.id_clube
              join campeonato CA on CA.id_campeonato = P.pertence
  where (IF(gols_mandante>gols_visitante, C2.nome, IF(gols_visitante>gols_mandante, C1.nome,null))) is not null
  group by campeonato, clube) as vitorias_por_campeonato
  group by campeonato;`;
  const values = [];
  const [rows] = await conn.query(sql, values);
  return object_keys(rows);
}

async function Consulta_Clube_NaoJogado(Nome)
{
  const conn = await connect();
  const sql = `SELECT *
  from clube C
  where not exists (select if(Mandante = ?,Visitante, Mandante)
                      from Partidas_resultados
                          where (Mandante = ? and Visitante = C.nome)
                          OR (Visitante = ? and Mandante =C.nome));`;
   const values = [Nome,Nome,Nome];
   const [rows] = await conn.query(sql, values);
   return object_keys(rows);
}

module.exports = {Consulta_Vencedores_Partidas, Consulta_Perdedores_Partidas, Consulta_Arbitros_Partidas, Consulta_Estatisticas_Vencedores, Consulta_Tecnicos_estrangeiros, Consulta_MaisVitorias_Campeonato, Consulta_Clube_NaoJogado, Consulta_Clube_historico, selectClubes, insertClube, UpdateClube, DeleteClube, insertPais, UpdatePais, DeletePais, insertArbitro, UpdateArbitro, DeleteArbitro, ConsultaEstadiosPorPais, Consulta_Estatisticas_goleiros}