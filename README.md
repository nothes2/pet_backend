# Pet Backend / Frontend Docker 部署

## 1. 前置条件
- 已安装 Docker
- 已安装 Docker Compose（`docker compose`）

## 2. 准备环境变量
在项目根目录执行：

```bash
cp .env.example .env
```

按需修改 `.env` 中的数据库密码、JWT 密钥、邮箱配置。

## 3. 启动服务
在项目根目录执行：

```bash
docker compose up -d --build
```

启动完成后：
- 前端: `http://localhost:3000`

说明：MySQL 默认不暴露主机端口，仅供容器内访问（更安全且避免端口冲突）。
说明：后端默认也不暴露主机端口，由前端通过容器网络转发 `/api` 访问。

## 4. 查看日志
```bash
docker compose logs -f
```

查看某个服务日志：
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

## 5. 停止服务
```bash
docker compose down
```

## 6. 彻底重置（含数据库）
```bash
docker compose down -v
docker compose up -d --build
```

说明：
- `db_pet.sql` 会在 MySQL 数据目录首次初始化时自动执行。
- 如果你已经有旧的 `mysql_data` 卷，SQL 初始化不会再次执行；可通过 `down -v` 重建。
