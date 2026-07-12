import unittest

from app.main import create_app


class CodityBackendAPITest(unittest.TestCase):

    def setUp(self):

        self.app = create_app()

        self.client = self.app.test_client()

        self.app.testing = True



    def test_home(self):

        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)



    def test_auth_health(self):

        response = self.client.get("/api/auth/")

        self.assertEqual(response.status_code, 200)



    def test_organizations(self):

        response = self.client.get("/api/organizations/")

        self.assertIn(response.status_code, [200, 404])

    def test_projects(self):

        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, 200)



    def test_queues(self):

        response = self.client.get("/api/queues/")

        self.assertEqual(response.status_code, 200)



    def test_jobs(self):

        response = self.client.get("/api/jobs")

        self.assertEqual(response.status_code, 200)



    def test_workers(self):

        response = self.client.get("/api/workers/")

        self.assertEqual(response.status_code, 200)



    def test_retry_policies(self):

        response = self.client.get(
            "/api/retry-policies/"
        )

        self.assertEqual(response.status_code, 200)



    def test_scheduled_jobs(self):

        response = self.client.get(
            "/api/scheduled-jobs"
        )

        self.assertEqual(response.status_code, 200)



    def test_job_executions(self):

        response = self.client.get(
            "/api/job-executions/"
        )

        self.assertEqual(response.status_code, 200)



    def test_dead_letters(self):

        response = self.client.get(
            "/api/dead-letters/"
        )

        self.assertEqual(response.status_code, 200)

  

    def test_metrics_dashboard(self):

        response = self.client.get(
            "/api/metrics/dashboard"
        )

        self.assertEqual(response.status_code, 200)

    def test_metrics_jobs(self):

        response = self.client.get(
            "/api/metrics/jobs"
        )

        self.assertEqual(response.status_code, 200)

    def test_metrics_workers(self):

        response = self.client.get(
            "/api/metrics/workers"
        )

        self.assertEqual(response.status_code, 200)

    def test_metrics_system(self):

        response = self.client.get(
            "/api/metrics/system"
        )

        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()