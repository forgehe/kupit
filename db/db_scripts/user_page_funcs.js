// SELECT id, user_id, is_sold, price, image_url, description, title, posting_date, stock, city
// FROM items
// WHERE is_viewable IS TRUE
// AND LOWER(title) LIKE '%item%'
// AND price < 10000
// and price > 6;

const { Pool } = require('pg')

const pool = new Pool ({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const user_data_search = function (user_id) {
  let values = [user_id];
  let queryString = `
    SELECT id, name, email, phone_number, profile_picture
    FROM users
    WHERE $1 = users.id;
  `;

  return pool.query(queryString, values).then(res => res.rows[0]).catch(err => err);
}

const user_message_list = function (user_id) {
  let values = [user_id];
  let queryString = `
  SELECT id, sender, reciever, item_id, created, body
  FROM messages
  WHERE sender = $1 OR reciever = $1
  ORDER BY created DESC; `

  return pool.query(queryString, values).then( res => res.rows).catch(err => err)
}

const user_message = function (message_id) {
  let values = [message_id];
  let queryString = `
  SELECT id, sender, reciever, item_id, created, body
  FROM messages
  WHERE messages.id = $1;
`
  return pool.query(queryString, values).then( res => res.rows[0]).catch(err => err)
}

const submit_message = function (sender, reciever, body, item_id) {
  let values = [sender, reciever, item_id, body];
  let queryString = `
  INSERT INTO messages (sender, reciever, item_id, body)
  VALUES ($1, $2, $3, $4)
  RETURNING * ;
  `
  return pool.query(queryString, values).then(res => res.rows[0]).catch(err => err)
}

const get_item_by_id = function (item_id) {
  let values = [item_id]
  let queryString = `
  SELECT *
  FROM items
  where id = $1
  `

  return pool.query(queryString, values).then(res => res.rows[0]).catch(err => err)

}

module.exports = {user_data_search, user_message_list, user_message, submit_message, get_item_by_id};
