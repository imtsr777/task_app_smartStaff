import pg  from 'pg'

const pool = new pg.Pool({
    connectionString: 'postgres://xbeoavak:SXf_VgqBy99Q-QHuPa6VqX3ul4S3R5UN@john.db.elephantsql.com/xbeoavak'
})

async function fetch(query, ...params){
    const client = await pool.connect()
    try{
       const {rows} =  await client.query(query, params.length > 0 ? params : null) 
       return rows; 
    }catch(error){
        return error;
    } finally {
        client.release()
    }
}

export default fetch;